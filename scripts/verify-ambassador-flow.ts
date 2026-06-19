import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🚧 Starting Ambassador Flow Verification...')

    const testMobile = '9999999999'
    const testReferralMobile = '8888888888'

    // 1. Cleanup
    try {
        console.log('🧹 Cleaning up previous test data...')
        await prisma.referralLead.deleteMany({
            where: { parentMobile: testReferralMobile }
        })
        await prisma.user.deleteMany({
            where: { mobileNumber: testMobile }
        })
    } catch (e) {
        // Ignore cleanup errors
    }

    // 2. Simulate Registration (Logic from src/app/actions.ts)
    console.log('👤 Simulating User Registration...')

    // Logic mirror:
    const hashedPassword = await bcrypt.hash('password123', 10)
    const referralCode = `ACH25-${Math.floor(1000 + Math.random() * 9000)}`

    const newUser = await prisma.user.create({
        data: {
            fullName: 'Test Verifier',
            mobileNumber: testMobile,
            password: hashedPassword,
            role: 'Parent',
            childInHeguru: false,
            referralCode: referralCode,
            benefitStatus: 'Inactive',
            studentFee: 60000,
            academicYear: '2025-2026',
            paymentStatus: 'Pending',
            paymentAmount: 0
        }
    })
    console.log(`✅ User Registered: ID ${newUser.userId}, RefCode: ${newUser.referralCode}`)

    // 3. Simulate Submit Referral (Logic from src/app/referral-actions.ts)
    console.log('🔗 Simulating Referral Submission...')

    const referral = await prisma.referralLead.create({
        data: {
            userId: newUser.userId,
            parentName: 'New Prospect',
            parentMobile: testReferralMobile,
            studentName: 'Little Champ',
            campus: 'ASM-VILLIANUR(9-12)',
            gradeInterested: 'Grade 5'
        }
    })
    console.log(`✅ Referral Created: ID ${referral.leadId}`)

    // 4. Verification
    console.log('🔍 Verifying Data Integrity...')

    const fetchedUser = await prisma.user.findUnique({
        where: { userId: newUser.userId },
        include: { referrals: true }
    })

    if (!fetchedUser) throw new Error('User not found after creation')
    if (fetchedUser.referrals.length !== 1) throw new Error(`Expected 1 referral, found ${fetchedUser.referrals.length}`)
    if (fetchedUser.referrals[0].parentMobile !== testReferralMobile) throw new Error('Referral mobile mismatch')

    console.log('🎉 Verification Successful! Relations are correct.')
}

main()
    .catch((e) => {
        console.error('❌ Verification Failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
