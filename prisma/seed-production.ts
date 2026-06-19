import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'
import * as path from 'path'

const prisma = new PrismaClient({
    log: ['info']
})

function getCampusCode(centerName: string, email: string | undefined): string {
    if (email) {
        const match = email.toLowerCase().trim().match(/hegl\.([a-z0-9]+)@/);
        if (match && match[1]) {
            return `H-${match[1].toUpperCase()}`;
        }
    }
    const cleanName = centerName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 8);
    return `H-${cleanName}`;
}

async function main() {
    console.log('Starting PRODUCTION seed for Heguru Centers...')

    // 0. Read Heguru Centers (1).xlsx
    const excelPath = path.resolve('Heguru Centers (1).xlsx')
    const workbook = XLSX.readFile(excelPath)

    // A. Parse Heguru Levels (Sheet 2) to construct the grades list
    const levelsSheet = workbook.Sheets['Heguru Levels']
    const levelRows: any[][] = XLSX.utils.sheet_to_json(levelsSheet, { header: 1 })
    const gradesList: string[] = []

    for (const row of levelRows) {
        if (!row || row.length < 2) continue
        const num = row[0]
        const levelName = row[1]
        const age = row[2]

        if (typeof num === 'number' && levelName) {
            let gradeName = levelName.toString().trim()
            if (age && age.toString().trim() !== '') {
                gradeName = `${gradeName} (${age.toString().trim()})`
            }
            gradesList.push(gradeName)
        }
    }
    const gradesString = gradesList.join(', ')
    console.log('Parsed Grades List:', gradesList)

    // B. Parse Heguru Locations (Sheet 1)
    const locationsSheet = workbook.Sheets['Heguru Locations']
    const locationsRows: any[][] = XLSX.utils.sheet_to_json(locationsSheet, { header: 1 })

    // Wipe existing targets, grade fees, and campuses
    console.log('Deleting existing Campus Targets...')
    try { await prisma.campusTarget.deleteMany({}) } catch (e) { console.log('Skipped CampusTarget deletion') }

    console.log('Deleting existing Grade Fees...')
    try { await prisma.gradeFee.deleteMany({}) } catch (e) { console.log('Skipped GradeFee deletion') }

    console.log('Deleting existing Campuses...')
    try { await prisma.campus.deleteMany({}) } catch (e) { console.log('Skipped Campus deletion. Note: If this fails, make sure student references are cleared first.') }

    // Seed campuses
    const seededCampuses: any[] = []

    for (let i = 0; i < locationsRows.length; i++) {
        const row = locationsRows[i]
        if (!row || row.length < 2 || !row[1]) continue

        const sNo = row[0]
        if (sNo === 'S.No' || typeof sNo !== 'number') continue

        const centerName = row[1].toString().trim()
        const address = row[2] ? row[2].toString().trim() : null
        const mapLink = row[3] ? row[3].toString().trim() : ''
        const email = row[4] ? row[4].toString().trim() : null
        const contact = row[5] ? row[5].toString().trim() : null

        const code = getCampusCode(centerName, email || undefined)
        const locationCity = centerName.split(' ')[0].trim()

        const campus = await prisma.campus.create({
            data: {
                campusName: centerName,
                campusCode: code,
                location: locationCity,
                grades: gradesString,
                address: address,
                contactEmail: email,
                contactPhone: contact ? contact.toString().trim() : null,
                maxCapacity: 500,
                currentEnrollment: 0,
                isActive: true
            }
        })
        seededCampuses.push(campus)
        console.log(`Seeded Campus: ${centerName} (${code}) in ${locationCity}`)
    }

    // Seed Grade Fees
    for (const campus of seededCampuses) {
        for (const grade of gradesList) {
            let otpFee = 35000
            let wotpFee = 40000

            if (grade.includes('PRESCHOOL')) {
                otpFee = 40000
                wotpFee = 45000
            } else if (grade.includes('PRIMARY')) {
                otpFee = 45000
                wotpFee = 50000
            }

            await prisma.gradeFee.create({
                data: {
                    campusId: campus.id,
                    grade: grade,
                    annualFee_otp: otpFee,
                    annualFee_wotp: wotpFee,
                    academicYear: '2025-2026'
                }
            })
        }
        console.log(`Seeded Grade Fees for campus: ${campus.campusName}`)
    }

    // 1. Benefits Slabs (Safe Upsert)
    console.log('Seeding Benefit Slabs...')
    const benefits = [
        { referralCount: 1, yearFeeBenefitPercent: 5, longTermExtraPercent: 5, baseLongTermPercent: 15 },
        { referralCount: 2, yearFeeBenefitPercent: 10, longTermExtraPercent: 10, baseLongTermPercent: 15 },
        { referralCount: 3, yearFeeBenefitPercent: 20, longTermExtraPercent: 15, baseLongTermPercent: 15 },
        { referralCount: 4, yearFeeBenefitPercent: 30, longTermExtraPercent: 20, baseLongTermPercent: 15 },
        { referralCount: 5, yearFeeBenefitPercent: 50, longTermExtraPercent: 25, baseLongTermPercent: 15 },
    ]

    for (const benefit of benefits) {
        await prisma.benefitSlab.upsert({
            where: { referralCount: benefit.referralCount },
            update: benefit,
            create: benefit,
        })
    }

    // 2. Admins (Upsert)
    console.log('Seeding Admins...')
    const admins = [
        { mobile: '9999999999', name: 'Super Admin', role: 'Super_Admin' },
        { mobile: '8888888888', name: 'Campus Head', role: 'Campus_Head' },
        { mobile: '7777777777', name: 'Admission Admin', role: 'Admission_Admin' },
        { mobile: '6666666666', name: 'Finance Admin', role: 'Finance_Admin' }
    ]

    for (const admin of admins) {
        await prisma.admin.upsert({
            where: { adminMobile: admin.mobile },
            update: {
                adminName: admin.name,
                role: admin.role as any
            },
            create: {
                adminName: admin.name,
                adminMobile: admin.mobile,
                password: '123456',
                role: admin.role as any
            }
        })
    }

    console.log('PRODUCTION Seeding completed successfully. No mock data generated.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
