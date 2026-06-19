const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const campusData = [
    { name: "ASM - VILLIANUR", email: "asmlead@heguru.org" },
    { name: "ABSM - THENGAITHITTU", email: "absmtt@heguru.org" },
    { name: "AKLAVYA - THENGAITHITTU", email: "aklavya@heguru.org" },
    { name: "SSV - VILLIANUR", email: "smphead@heguru.org" },
    { name: "ASM - THAVALAKUPPAM", email: "asm.tvm@heguru.org" },
    { name: "ASM - MOOLAKULAM", email: "asm.mkm@heguru.org" },
    { name: "ASM - KARAIKAL", email: "asm.kkl@heguru.org" },
    { name: "AWGI - ETTIMADAI", email: "principal.awgi@heguru.org" },
    { name: "AIIS - ERODE", email: "principal.aiis@heguru.org" },
    { name: "ASM - TRICHY", email: "principal.trichy@heguru.org" },
    { name: "ABSM - TINDIVANAM", email: "absm.tindivanam@heguru.org" },
    { name: "ASM - VILLUPURAM", email: "asm.vpm@heguru.org" },
    { name: "AKLAVYA - REDDIYARPALAYAM", email: "rp.aklavya@heguru.org" },
    { name: "ASM - MUTHIRAPALAYAM", email: "asmmp@heguru.org" },
    { name: "ABSM - GORIMEDU", email: "absmgm@heguru.org" },
    { name: "ABSM - LAWSPET", email: "absmgm@heguru.org" },
    { name: "ABSM - MUTHIYALPET", email: "absm.mlp@heguru.org" },
    { name: "ABSM - KALAPET", email: "absmkp@heguru.org" },
    { name: "ABSM - VENKATA NAGAR", email: "absmvn@heguru.org" },
    { name: "AKLAVYA - ANUGRAHA", email: "aklavya.anugraha@heguru.org" },
    { name: "ABSM - TRICHY", email: "principal.trichy@heguru.org" },
    { name: "ASM CC - ERODE", email: "asm.efc@heguru.org" },
    { name: "ASM - PERUNDURAI", email: "asm.epc@heguru.org" },
    { name: "ASM - ALAPAKKAM", email: "asmprincipal.ch@heguru.org" },
    { name: "ABSM - ADYAR", email: "absmadyar.ch@heguru.org" },
    { name: "ABSM - KK NAGAR", email: "absmkknagar.ch@heguru.org" },
    { name: "ABSM - VARASALAVAKAM", email: "absmvalasaravakkam.ch@heguru.org" },
    { name: "ABSM - PADMANABHANAGAR", email: "absmpadmanabanagar.ch@heguru.org" },
    { name: "ABSM - DASARATHAPURAM", email: "absmvirugambakkam.ch@heguru.org" },
    { name: "ABSM - SALIGRAMAM", email: "absmsaligramam.ch@heguru.org" },
    { name: "ABSM - RK NAGAR", email: "absmrknagar.ch@heguru.org" },
    { name: "ABSM - ALAPAKKAM", email: "absmporur.ch@heguru.org" },
    { name: "ABSM - THIRU NAGAR", email: "absmthirunagar.ch@heguru.org" },
    { name: "ABSM - MADURAVOYAL", email: "absmmaduravoyal.ch@heguru.org" },
    { name: "ABSM - NOLAMBUR", email: "absmnolambur.ch@heguru.org" },
    { name: "ABSM PP - THENGAITHITTU", email: "absmpphead@heguru.org" },
    { name: "SSV HSC- VILLIANUR", email: "asmresidentialprincipal@heguru.org" },
    { name: "ASM HSC - VILLIANUR", email: "asmhead@heguru.org" },
    { name: "ACET", email: "acethead@heguru.org" },
    { name: "AASC", email: "aaschead@heguru.org" },
    { name: "ACCHM", email: "principal.acchm@heguru.org" }
]

async function update() {
    let updatedCount = 0
    for (const item of campusData) {
        try {
            const result = await prisma.campus.updateMany({
                where: { campusName: item.name },
                data: { contactEmail: item.email }
            })
            if (result.count > 0) {
                updatedCount++
                console.log(`✅ Updated: ${item.name} -> ${item.email}`)
            } else {
                console.warn(`⚠️ Not found in DB: ${item.name}`)
            }
        } catch (e) {
            console.error(`❌ Error updating ${item.name}:`, e.message)
        }
    }
    console.log(`\n🎉 FINISHED: Successfully updated ${updatedCount} campuses.`)
    await prisma.$disconnect()
}

update()
