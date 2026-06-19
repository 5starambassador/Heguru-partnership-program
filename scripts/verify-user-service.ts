import { userService } from '../src/services/user-service';
import prisma from '../src/lib/prisma';

async function verifyUserService() {
    console.log("🔍 Verifying UserService...");

    // 1. Test getAllUsers (using empty filter for now, or mock scope)
    // Note: In real app, scope comes from permission service. Here we test raw service.
    try {
        const result = await userService.getAllUsers({});
        if (result.success) {
            console.log(`✅ getAllUsers success. Found ${result.data.length} users.`);
        } else {
            console.error(`❌ getAllUsers failed: ${result.error}`);
        }
    } catch (e) {
        console.error("❌ getAllUsers crashed:", e);
    }

    // 2. Test addUser (Mock Data)
    const testMobile = "9999999999";
    try {
        // Cleanup first
        await prisma.user.deleteMany({ where: { mobileNumber: testMobile } });

        const addResult = await userService.addUser({
            fullName: "Service Test User",
            mobileNumber: testMobile,
            role: "Parent",
            childInHeguru: false
        }, "SYSTEM");

        if (addResult.success) {
            console.log(`✅ addUser success. Created user ID: ${addResult.data.userId}`);

            // 3. Test toggleStatus
            const toggleResult = await userService.toggleStatus(addResult.data.userId, 'Inactive', "SYSTEM");
            if (toggleResult.success && toggleResult.data.status === 'Inactive') {
                console.log("✅ toggleStatus success.");
            } else {
                console.error("❌ toggleStatus failed.");
            }

            // Cleanup
            await userService.deleteUser(addResult.data.userId, "SYSTEM");
            console.log("✅ deleteUser success (cleanup).");

        } else {
            console.error(`❌ addUser failed: ${addResult.error}`);
        }

    } catch (e) {
        console.error("❌ CRUD test crashed:", e);
    }
}

verifyUserService()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
