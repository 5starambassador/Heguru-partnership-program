const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function check() {
    const [
        oldFilter,   // old: benefitStatus Active
        newFilter,   // new: childInHeguru OR staff empId
        childVerified,
        staffVerified,
        pendingFilter // pending: PendingVerification
    ] = await Promise.all([
        p.user.count({ where: { benefitStatus: 'Active' } }),
        p.user.count({
            where: {
                OR: [
                    { childInHeguru: true },
                    { role: 'Staff', empId: { not: null }, NOT: { empId: 'N/A' } }
                ]
            }
        }),
        p.user.count({ where: { childInHeguru: true } }),
        p.user.count({ where: { role: 'Staff', empId: { not: null }, NOT: { empId: 'N/A' } } }),
        p.user.count({ where: { benefitStatus: 'PendingVerification' } })
    ]);

    console.log('=== VERIFIED TAB COUNTS ===');
    console.log(`Old filter (benefitStatus Active):       ${oldFilter}  ← currently showing (wrong)`);
    console.log(`New filter (childInHeguru OR empId):   ${newFilter}  ← will show after fix`);
    console.log(`  - Parents with childInHeguru=true:   ${childVerified}`);
    console.log(`  - Staff with valid empId:               ${staffVerified}`);
    console.log(`\n=== PENDING TAB COUNT ===`);
    console.log(`Pending (PendingVerification):           ${pendingFilter}`);
}

check().catch(console.error).finally(() => p.$disconnect());
