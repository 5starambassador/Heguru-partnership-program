import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function run() {
    console.log("Starting DB benchmark...")
    const connectStart = Date.now()
    await prisma.$connect()
    console.log(`Prisma $connect took: ${Date.now() - connectStart}ms`)

    for (let i = 0; i < 5; i++) {
        const start = Date.now()
        await prisma.$queryRaw`SELECT 1`
        console.log(`[Query ${i+1}] Raw SELECT 1 took: ${Date.now() - start}ms`)
    }

    const start2 = Date.now()
    await prisma.systemSettings.findFirst()
    console.log(`findFirst settings took: ${Date.now() - start2}ms`)

    await prisma.$disconnect()
}
run()
