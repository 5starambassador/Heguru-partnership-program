
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkVerifiedCounts() {
    try {
        console.log('--- FINAL VERIFIED COUNT CHECK ---');

        // New Logic Total
        const totalVerified = await prisma.user.count({
            where: {
                childInHeguru: true
            }
        });

        // Current Benefit Active (Referral Rewards)
        const benefitActive = await prisma.user.count({
            where: {
                benefitStatus: 'Active'
            }
        });

        const staffVerified = await prisma.user.count({
            where: {
                role: 'Staff',
                childInHeguru: true
            }
        });

        const parentsVerified = await prisma.user.count({
            where: {
                role: 'Parent',
                childInHeguru: true
            }
        });

        console.log(`Total Verified (childInHeguru: true): ${totalVerified}`);
        console.log(`- Verified Parents: ${parentsVerified}`);
        console.log(`- Verified Staff (with child): ${staffVerified}`);
        console.log(`- Users with ACTIVE Referral Benefits: ${benefitActive}`);
        
        console.log('\n--- SAMPLE CHECK ---');
        // Check a few users who are verified but have 0 referrals
        const sampleVerifiedNoReferrals = await prisma.user.findMany({
            where: {
                childInHeguru: true,
                confirmedReferralCount: 0
            },
            select: {
                fullName: true,
                role: true,
                benefitStatus: true
            },
            take: 5
        });

        console.log('Sample Users (Verified Parent + 0 Referrals):');
        sampleVerifiedNoReferrals.forEach(u => {
            console.log(`- ${u.fullName} (${u.role}): Benefit Status is ${u.benefitStatus}`);
        });

    } catch (error) {
        console.error('Error checking counts:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkVerifiedCounts();
