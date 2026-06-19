import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ifscSchema, accountNumberSchema } from '@/lib/validators'

export async function POST(request: Request) {
    try {
        const session = await getSession()

        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const userId = Number(session.userId)
        const userType = session.userType as 'user' | 'admin'


        const body = await request.json()
        const { fullName, email, address, childEprNo, grade, childCampusId, bankName, accountNumber, ifscCode, childName, academicYear } = body

        if (ifscCode) {
            const result = ifscSchema.safeParse(ifscCode)
            if (!result.success) {
                return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
            }
        }

        if (accountNumber) {
            const result = accountNumberSchema.safeParse(accountNumber)
            if (!result.success) {
                return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
            }
        }

        if (!fullName || fullName.trim().length < 2) {
            return NextResponse.json({ error: 'Full name must be at least 2 characters' }, { status: 400 })
        }

        // Update based on user type (the userId in session is mapped correctly to the primary key of each table)
        if (userType === 'admin') {
            await prisma.admin.update({
                where: { adminId: userId },
                data: {
                    adminName: fullName.trim(),
                    email: email?.trim() || null,
                    address: address?.trim() || null
                }
            })
        } else {
            // Check if sensitive Child Details are being updated
            // Only update them if provided, and if changed, set benefitStatus to PendingVerification?
            // User requested: "ok but verified by admin". So we save data but maybe reset benefitStatus?

            // Only update sensitive details if provided

            const updateData: any = {
                fullName: fullName.trim(),
                email: email?.trim() || null,
                address: address?.trim() || null
            }

            // Allow updating Bank Details if provided
            if (bankName !== undefined) updateData.bankName = bankName
            if (accountNumber !== undefined) updateData.accountNumber = accountNumber
            if (ifscCode !== undefined) updateData.ifscCode = ifscCode

            // Only update child details if present (Staff flow)
            if (childEprNo !== undefined) updateData.childEprNo = childEprNo
            if (grade !== undefined) updateData.grade = grade
            if (childName !== undefined) updateData.childName = childName
            if (academicYear !== undefined) updateData.academicYear = academicYear

            // Safely handle childCampusId
            if (childCampusId !== undefined && childCampusId !== null && childCampusId !== '') {
                const parsedId = parseInt(childCampusId)
                if (!isNaN(parsedId)) {
                    updateData.childCampusId = parsedId
                }
            } else if (childCampusId === '') {
                // If explicitly cleared, invoke null? Or just ignore? 
                // schema allows Int? so null is fine.
                updateData.childCampusId = null
            }

            // Let's update childEprNo and grade. 
            // And set benefitStatus = 'PendingVerification' so Admin sees it.

            if (grade !== undefined || childEprNo !== undefined || childName !== undefined || academicYear !== undefined) {
                // @ts-ignore - Enum might be stale in some environments
                updateData.benefitStatus = 'PendingVerification'
            }

            await prisma.user.update({
                where: { userId: userId },
                data: updateData
            })
        }

        // Sync: Notify Admin
        revalidatePath('/superadmin/verification')
        revalidatePath('/superadmin/users')
        revalidatePath('/superadmin')
        revalidatePath('/dashboard')
        revalidatePath('/campus')
        revalidatePath('/admin')

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Profile update error FINAL:', error)
        console.error('Error Stack:', error.stack)
        // detailed prisma error
        if (error.code) {
            console.error('Prisma Error Code:', error.code)
            console.error('Prisma Error Meta:', error.meta)
        }
        return NextResponse.json({
            error: 'Failed to update profile',
            details: error.message
        }, { status: 500 })
    }
}
