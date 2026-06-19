
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function updateParentFlags() {
    console.log('--- Updating ALL Parent Flags ---')
    
    // We update ALL users with role 'Parent' to have childInHeguru = true
    const updateResult = await prisma.user.updateMany({
        where: {
            role: 'Parent' as any
        },
        data: {
            childInHeguru: true
        }
    })

    console.log(`Successfully updated ${updateResult.count} Parent users.`)
}

updateParentFlags().catch(console.error).finally(() => prisma.$disconnect())
