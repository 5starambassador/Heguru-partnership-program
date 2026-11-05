import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config()

async function run() {
    const rawUrl = process.env.DATABASE_URL || ""
    // Remove -pooler and remove pgbouncer=true / connection_limit parameters
    const directUrl = rawUrl
        .replace("-pooler", "")
        .replace("pgbouncer=true", "")
        .replace("connection_limit=20", "")
        .replace("&&", "&")
        .replace("?&", "?")

    console.log("Direct URL (no pooler):", directUrl.split('@')[1])

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: directUrl
            }
        }
    })

    console.log("Starting Direct DB benchmark...")
    const connectStart = Date.now()
    await prisma.$connect()
    console.log(`Prisma direct $connect took: ${Date.now() - connectStart}ms`)

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
run().catch(console.error)
