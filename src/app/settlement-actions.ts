'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-service'
import { logAction, logSecurityAlert } from '@/lib/audit-logger'
import { revalidatePath } from 'next/cache'
import { transactionIdSchema } from '@/lib/validators'
import { calculateTotalBenefit } from '@/lib/benefit-calculator'
import { normalizeGrade } from '@/lib/utils'

/**
 * Fetches all settlement records with associated user details.
 */
export async function getSettlements() {
    try {
        const settlements = await prisma.settlement.findMany({
            include: {
                user: {
                    select: {
                        fullName: true,
                        mobileNumber: true,
                        role: true,
                        bankAccountDetails: true,
                        studentFee: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Mask sensitive bank details
        const maskedSettlements = settlements.map(s => ({
            ...s,
            user: s.user ? {
                ...s.user,
                bankAccountDetails: s.user.bankAccountDetails ? '***MASKED***' : null
            } : null
        }))

        // Anomaly Detection: Bulk read alert
        if (settlements.length > 500) {
            await logSecurityAlert(`Large bulk settlement read: ${settlements.length} records`, { count: settlements.length })
        }

        await logAction('READ', 'settlement', `Bulk read of ${settlements.length} settlement records (PII masked)`, null, null, { count: settlements.length })
        return { success: true, settlements: maskedSettlements }
    } catch (error) {
        console.error('getSettlements error:', error)
        return { success: false, error: 'Failed to fetch settlements' }
    }
}

/**
 * Fetches settlement records for a specific user.
 */
export async function getUserSettlements(userId: number) {
    try {
        const settlements = await prisma.settlement.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        })

        await logAction('READ', 'settlement', `Read settlement history for user ${userId}`, userId.toString())
        return { success: true, settlements }
    } catch (error) {
        console.error('getUserSettlements error:', error)
        return { success: false, error: 'Failed to fetch user settlements' }
    }
}

/**
 * Calculates current amount due to an ambassador.
 * Rule: Sum of one-month fees of confirmed/admitted referrals - TotalPreviouslySettled
 */
export async function calculatePendingSettlement(userId: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { userId },
            select: {
                userId: true,
                role: true,
                childInHeguru: true,
                studentFee: true,
                isFiveStarMember: true,
                settlements: {
                    select: { amount: true }
                }
            }
        })

        if (!user) return { success: false, error: 'User not found' }

        // Fetch user's confirmed/admitted referrals
        const referrals = await prisma.referralLead.findMany({
            where: {
                userId,
                leadStatus: { in: ['Confirmed', 'Admitted'] }
            },
            include: {
                student: {
                    select: { annualFee: true, paymentCycle: true }
                }
            }
        })

        // Fetch all grade fees for the cycle
        const gradeFees = await prisma.gradeFee.findMany({
            where: {
                academicYear: '2026-2027'
            }
        })

        // Build grade fee map
        const gradeFeeMap = new Map()
        gradeFees.forEach(gf => {
            const key = gf.campusId + '-' + normalizeGrade(gf.grade)
            gradeFeeMap.set(key, gf)
        })

        // Map referrals to ReferralData format
        const formattedReferrals = referrals.map((r: any) => {
            const normGrade = normalizeGrade(r.gradeInterested || '')
            const gf = gradeFeeMap.get(r.campusId + '-' + normGrade)
            let annualFee = r.annualFee || r.student?.annualFee || 0
            if (annualFee === 0 && gf) {
                annualFee = r.selectedFeeType === 'OTP' ? (gf.annualFee_otp || gf.annualFee_wotp || 0) : (gf.annualFee_wotp || gf.annualFee_otp || 0)
            }
            return {
                id: r.leadId,
                campusId: r.campusId || 0,
                grade: r.gradeInterested || '',
                actualFee: annualFee,
                campusGrade1Fee: annualFee,
                paymentCycle: r.paymentCycle || r.student?.paymentCycle || 'YEARLY'
            }
        })

        const slabs = await prisma.benefitSlab.findMany({
            orderBy: { referralCount: 'asc' }
        })

        const calc = calculateTotalBenefit(formattedReferrals, {
            role: user.role as any,
            childInHeguru: user.childInHeguru,
            studentFee: user.studentFee || 0,
            isFiveStarLastYear: user.isFiveStarMember
        }, slabs as any)

        const totalEarned = calc.totalAmount
        const totalSettled = user.settlements.reduce((acc, s) => acc + s.amount, 0)
        const pending = Math.max(0, totalEarned - totalSettled)

        return { success: true, pending, totalEarned, totalSettled, benefitPercent: 0 }
    } catch (error) {
        console.error('calculatePendingSettlement error:', error)
        return { success: false, error: 'Calculation failed' }
    }
}

/**
 * Creates a new settlement entry in Pending status.
 * USES ATOMIC TRANSACTION: Verifies actual pending balance on server before creation.
 */
export async function createSettlement(userId: number, amount: number) {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized' }
    }

    if (amount <= 0) {
        return { success: false, error: 'Invalid settlement amount' }
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Fetch User data inside transaction
            const user = await tx.user.findUnique({
                where: { userId },
                select: {
                    userId: true,
                    role: true,
                    childInHeguru: true,
                    studentFee: true,
                    isFiveStarMember: true,
                    settlements: {
                        select: { amount: true }
                    }
                }
            })

            if (!user) throw new Error('User not found')

            // Fetch user's confirmed/admitted referrals
            const referrals = await tx.referralLead.findMany({
                where: {
                    userId,
                    leadStatus: { in: ['Confirmed', 'Admitted'] }
                },
                include: {
                    student: {
                        select: { annualFee: true }
                    }
                }
            })

            // Fetch all grade fees for the cycle
            const gradeFees = await tx.gradeFee.findMany({
                where: {
                    academicYear: '2026-2027'
                }
            })

            // Build grade fee map
            const gradeFeeMap = new Map()
            gradeFees.forEach(gf => {
                const key = gf.campusId + '-' + normalizeGrade(gf.grade)
                gradeFeeMap.set(key, gf)
            })

            // Map referrals to ReferralData format
            const formattedReferrals = referrals.map((r: any) => {
                const normGrade = normalizeGrade(r.gradeInterested || '')
                const gf = gradeFeeMap.get(r.campusId + '-' + normGrade)
                let annualFee = r.annualFee || r.student?.annualFee || 0
                if (annualFee === 0 && gf) {
                    annualFee = r.selectedFeeType === 'OTP' ? (gf.annualFee_otp || gf.annualFee_wotp || 0) : (gf.annualFee_wotp || gf.annualFee_otp || 0)
                }
                return {
                    id: r.leadId,
                    campusId: r.campusId || 0,
                    grade: r.gradeInterested || '',
                    actualFee: annualFee,
                    campusGrade1Fee: annualFee
                }
            })

            // 2. Recalculate Benefit inside transaction
            const slabs = await tx.benefitSlab.findMany({
                orderBy: { referralCount: 'asc' }
            })

            const calc = calculateTotalBenefit(formattedReferrals, {
                role: user.role as any,
                childInHeguru: user.childInHeguru,
                studentFee: user.studentFee || 0,
                isFiveStarLastYear: user.isFiveStarMember
            }, slabs as any)

            const totalEarned = calc.totalAmount
            const totalSettled = user.settlements.reduce((acc, s) => acc + s.amount, 0)
            const actualPending = Math.max(0, totalEarned - totalSettled)

            // 3. Strict Verification: Is the requested amount valid?
            if (amount > actualPending + 0.01) {
                throw new Error(`Insufficient Balance: Available ₹${actualPending}, Requested ₹${amount}`)
            }

            // 4. Create Settlement
            const settlement = await tx.settlement.create({
                data: {
                    userId,
                    amount,
                    status: 'Pending'
                }
            })

            return settlement
        })

        await logAction('CREATE', 'settlement', `Created pending settlement for user ${userId}: ₹${amount}`, result.id.toString())
        revalidatePath('/superadmin')
        return { success: true, settlement: result }
    } catch (error: any) {
        console.error('createSettlement error:', error)
        return { success: false, error: error.message || 'Failed to create settlement' }
    }
}

/**
 * Completes a settlement by marking as Processed and adding bank reference details.
 */
export async function processSettlement(id: number, data: { bankReference: string, payoutDate?: Date, remarks?: string }) {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized' }
    }

    if (!data.bankReference) {
        return { success: false, error: 'Bank reference / Transaction ID is required' }
    }

    const validation = transactionIdSchema.safeParse(data.bankReference)
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message }
    }

    try {
        const settlement = await prisma.settlement.update({
            where: { id },
            data: {
                status: 'Processed',
                bankReference: data.bankReference,
                payoutDate: data.payoutDate || new Date(),
                remarks: data.remarks,
                processedBy: admin.userId
            }
        })

        await logAction('UPDATE', 'settlement', `Processed settlement ${id} (Ref: ${data.bankReference})`, id.toString())
        revalidatePath('/superadmin')
        return { success: true, settlement }
    } catch (error) {
        console.error('processSettlement error:', error)
        return { success: false, error: 'Failed to process settlement' }
    }
}

/**
 * Deletes a pending settlement record.
 */
export async function deleteSettlement(id: number) {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        await prisma.settlement.delete({ where: { id } })
        await logAction('DELETE', 'settlement', `Deleted settlement entry ${id}`, id.toString())
        revalidatePath('/superadmin')
        return { success: true }
    } catch (error) {
        console.error('deleteSettlement error:', error)
        return { success: false, error: 'Failed to delete' }
    }
}
