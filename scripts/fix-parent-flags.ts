
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function updateParentFlags() {
    console.log('--- Updating Parent Flags ---')
    
    // We use the exact enum value 'Parent' from schema.prisma
    const updateResult = await prisma.user.updateMany({
        where: {
            role: 'Parent',
            OR: [
                { childInHeguru: false },
                { childInHeguru: null } as any
            ]
        },
        data: {
            childInHeguru: true
        }
    })

    console.log(`Successfully updated ${updateResult.count} Parent users to childInHeguru = true.`)
    
    // Verification count
    const remaining = await prisma.user.count({
        where: {
            role: 'Parent',
            childInHeguru: false
        }
    })
    console.log(`Parents still with childInHeguru = false: ${remaining}`)
}

updateParentFlags().catch(console.error).finally(() => prisma.$disconnect())
