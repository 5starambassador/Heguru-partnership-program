'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-service'
import { calculateTotalBenefit } from '@/lib/benefit-calculator'
import { getSpecialBonusRate } from '@/lib/reward-constants'
import { normalizeGrade } from '@/lib/utils'

/**
 * Generates a complete financial ledger for a specific ambassador.
 * Returns a chronological list of earnings (referrals) and settlements (payouts/waivers).
 */
export async function getAmbassadorLedger(userId: number, academicYear: string = '2026-2027') {
    const admin = await getCurrentUser()
    // Admin or self can view
    if (!admin || (Number(admin.userId) !== userId && admin.role !== 'Super Admin')) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        // 1. Fetch Academic Year dates for boundary filtering
        const yearRecord = await prisma.academicYear.findUnique({
            where: { year: academicYear }
        })

        const dateFilter = yearRecord ? {
            createdAt: {
                gte: yearRecord.startDate,
                lte: yearRecord.endDate
            }
        } : {}

        // 2. Fetch User data with all components
        const u = await prisma.user.findUnique({
            where: { userId },
            include: {
                settlements: {
                    orderBy: { createdAt: 'desc' }
                },
                referrals: {
                    where: {
                        leadStatus: { in: ['Confirmed', 'Admitted'] }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!u) return { success: false, error: 'User not found' }

        // 3. Fetch Slabs and Fees for calculation
        const [slabs, gradeFees] = await Promise.all([
            prisma.benefitSlab.findMany({ orderBy: { referralCount: 'asc' } }),
            prisma.gradeFee.findMany({
                where: {
                    academicYear
                }
            })
        ])

        const gradeFeeMap = new Map()
        gradeFees.forEach(gf => {
            const key = gf.campusId + '-' + normalizeGrade(gf.grade)
            gradeFeeMap.set(key, gf)
        })

        // 4. Split Referrals into Current Cycle vs Historical
        const currentReferrals = u.referrals.filter((r: any) => {
            const isTargetYear = r.admittedYear === academicYear
            const isDateMatch = yearRecord && r.createdAt >= yearRecord.startDate && r.createdAt <= yearRecord.endDate
            return isTargetYear || isDateMatch
        })

        const historicalReferrals = u.referrals.filter((r: any) => !currentReferrals.some((curr: any) => curr.leadId === r.leadId))

        const calculatorReferrals = currentReferrals.map((r: any) => {
            const normGrade = normalizeGrade(r.gradeInterested || '')
            const gf = gradeFeeMap.get(r.campusId + '-' + normGrade)
            let annualFee = r.annualFee || 0
            if (annualFee === 0 && gf) {
                annualFee = r.selectedFeeType === 'OTP' ? (gf.annualFee_otp || gf.annualFee_wotp || 0) : (gf.annualFee_wotp || gf.annualFee_otp || 0)
            }
            return {
                id: r.leadId,
                campusId: r.campusId || 0,
                campusName: r.campus || undefined,
                grade: r.gradeInterested || 'Grade-1',
                actualFee: annualFee,
                campusGrade1Fee: annualFee,
                admissionFeeCollected: r.admissionFeeCollected || 0,
                donationFeeCollected: r.donationFeeCollected || 0,
                specialBonusRate: 0,
                paymentCycle: r.paymentCycle || 'YEARLY'
            }
        })

        const historicalFormatted = historicalReferrals.map((r: any) => ({
            id: r.leadId,
            campusId: r.campusId || 0,
            campusName: r.campus || undefined,
            grade: r.gradeInterested || 'Grade-1',
            actualFee: r.annualFee || 0
        }))

        const calc = calculateTotalBenefit(calculatorReferrals, {
            role: u.role as any,
            childInHeguru: u.childInHeguru,
            studentFee: u.studentFee || 0,
            isFiveStarLastYear: u.isFiveStarMember,
            previousYearReferrals: historicalFormatted
        }, slabs as any)

        // 5. Construct chronological ledger entries
        const ledgerEntries: any[] = []

        // Filter ledger referrals to only show the ones relevant to this cycle if needed?
        // Actually, Ledger usually shows everything, but the summary is for the cycle.
        // Let's keep all settlements but only show current cycle earnings in ledger to match summary.
        // Or show all, but summary is cycle-specific. 
        // User said: "atleast one referral activation is required for get the benefit for this year 2026-2027"
        // So the ledger should reflect the ACTIVATED earnings.

        // A. Add Settlements (Payouts/Waivers) as DEBITS (reduces remaining amount)
        u.settlements.forEach((s: any) => {
            const isWaiver = (s.remarks || '').toLowerCase().includes('waiver')
            const isRefund = (s.remarks || '').toLowerCase().includes('registration') || s.amount === 25

            ledgerEntries.push({
                id: `S-${s.id}`,
                type: isRefund ? 'REFUND' : (isWaiver ? 'WAIVER' : 'PAYOUT'),
                txId: s.bankReference || `ID: ${s.id}`,
                amount: s.amount,
                date: s.createdAt,
                status: s.status,
                remarks: s.remarks,
                direction: 'OUT'
            })
        })

        const isGroupAWaiver = (u.role === 'Parent' || u.role === 'Staff') && !!u.childInHeguru

        // B. Add Earnings (Current Cycle Confirmed Referrals)
        currentReferrals.forEach((r: any) => {
            const normGrade = normalizeGrade(r.gradeInterested || '')
            const gf = gradeFeeMap.get(r.campusId + '-' + normGrade)
            let annualFee = r.annualFee || 0
            if (annualFee === 0 && gf) {
                annualFee = r.selectedFeeType === 'OTP' ? (gf.annualFee_otp || gf.annualFee_wotp || 0) : (gf.annualFee_wotp || gf.annualFee_otp || 0)
            }
            const oneMonthFee = Math.round(annualFee / 12)

            const specialBonus = 0
            const admBonus = isGroupAWaiver ? 0 : oneMonthFee
            const donBonus = 0
            const slabIndividualShare = isGroupAWaiver ? oneMonthFee : 0

            const totalRefYield = oneMonthFee

            ledgerEntries.push({
                id: `R-${r.leadId}`,
                type: 'EARNING',
                txId: r.admissionNumber ? `EPR: ${r.admissionNumber}` : `Lead: ${r.leadId}`,
                amount: totalRefYield,
                date: r.confirmedDate || r.createdAt,
                status: 'Confirmed',
                remarks: `Referral: ${r.studentName} (${r.campus})`,
                direction: 'IN',
                breakdown: {
                    specialBonus,
                    admBonus,
                    donBonus,
                    slabShare: slabIndividualShare,
                    tierPercent: 0
                }
            })
        })

        // C. If long term is active, add historical yield as a single ledger entry or split?
        // Usually, it's a "bonus" applied to the account.
        if (calc.longTermBaseAmount > 0) {
            ledgerEntries.push({
                id: `L-HISTORIC`,
                type: 'BONUS',
                txId: '5-STAR-BONUS',
                amount: calc.longTermBaseAmount,
                date: currentReferrals[0]?.confirmedDate || u.referrals[0]?.createdAt,
                status: 'Confirmed',
                remarks: `5-Star Loyalty Bonus (3% Historical Yield)`,
                direction: 'IN'
            })
        }

        // Sort by date DESC
        ledgerEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        const totalSettledCounted = u.settlements
            .filter((s: any) => s.status === 'Processed')
            .reduce((acc: number, s: any) => acc + s.amount, 0)

        return {
            success: true,
            data: {
                ledger: ledgerEntries,
                summary: {
                    totalEarned: calc.totalAmount,
                    totalSettled: totalSettledCounted,
                    outstanding: calc.totalAmount - totalSettledCounted,
                    referralCount: currentReferrals.length,
                    tierPercent: calc.tierPercent
                }
            }
        }
    } catch (error) {
        console.error('Error in getAmbassadorLedger:', error)
        return { success: false, error: 'Failed to generate ledger' }
    }
}
