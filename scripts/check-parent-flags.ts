
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkParentFlags() {
    const totalParents = await prisma.user.count({
        where: { role: 'Parent' }
    })

    const parentsWithoutFlag = await prisma.user.count({
        where: {
            role: 'Parent',
            childInHeguru: false
        }
    })

    console.log(`Total Parents: ${totalParents}`)
    console.log(`Parents with childInHeguru = false/null: ${parentsWithoutFlag}`)
}

checkParentFlags().catch(console.error).finally(() => prisma.$disconnect())
