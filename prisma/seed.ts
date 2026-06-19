import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'
import * as path from 'path'

const prisma = new PrismaClient({
    log: ['info']
})

const STAFF_NAMES = ["Suresh Chandran", "Amit Patel", "Deepa Thomas", "Karan Johar", "Priya Menon"]
const PARENT_NAMES = ["Vikram Rathore", "Anjali Gupta", "Rohit Sharma", "Sneha Reddy", "Manish Malhotra"]

const SLABS = { 1: 5, 2: 10, 3: 20, 4: 30, 5: 50 } as const

// Names to rotate through for leads
const LEAD_NAMES = [
    "Ramesh Gupta", "Sita Verma", "Vikram Singh", "Anita Roy", "Rajesh Kumar",
    "Priya Malik", "Amit Shah", "Sneha Reddy", "Karan Johar", "Deepika P",
    "Sanjay Dutt", "Meena Kumari", "Arun Jaitley", "Sushma Swaraj", "Narendra M"
]

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
    console.log('Starting seed...')

    // 0. Cleanup existing data to prevent duplicates / foreign key constraint violations
    console.log('Cleaning up existing data...')
    await prisma.ticketMessage.deleteMany({})
    await prisma.supportTicket.deleteMany({})
    await prisma.settlement.deleteMany({})
    await prisma.student.deleteMany({})
    await prisma.referralLead.deleteMany({})
    await prisma.programLead.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.campusTarget.deleteMany({})
    await prisma.gradeFee.deleteMany({})
    await prisma.campus.deleteMany({})
    console.log('Cleanup complete.')

    // 1. Benefits Slabs
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
            update: {},
            create: benefit,
        })
    }

    // 2. Admins
    const admins = [
        { mobile: '9999999999', name: 'Super Admin', role: 'Super_Admin' },
        { mobile: '8888888888', name: 'Campus Head', role: 'Campus_Head' },
        { mobile: '7777777777', name: 'Admission Admin', role: 'Admission_Admin' },
        { mobile: '6666666666', name: 'Finance Admin', role: 'Finance_Admin' }
    ]

    for (const admin of admins) {
        await prisma.admin.upsert({
            where: { adminMobile: admin.mobile },
            update: {},
            create: {
                adminName: admin.name,
                adminMobile: admin.mobile,
                password: '123456',
                role: admin.role as any
            }
        })
    }

    // 3. Read Heguru Centers (1).xlsx
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

    // B. Parse Heguru Locations (Sheet 1) and seed Campuses
    const locationsSheet = workbook.Sheets['Heguru Locations']
    const locationsRows: any[][] = XLSX.utils.sheet_to_json(locationsSheet, { header: 1 })
    
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

    // 4. Grade Fees
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

    // 5. Generate Users & Leads
    await generateGroup(STAFF_NAMES, 'Staff', '900000000') // 9 digits
    await generateGroup(PARENT_NAMES, 'Parent', '910000000') // 9 digits

    // 6. Generate Students
    await generateStudents()

    console.log('Seeding completed.')
}

async function generateGroup(names: string[], role: string, mobilePrefix: string) {
    for (let i = 0; i < names.length; i++) {
        const referralCount = i + 1
        const name = names[i]
        const mobile = `${mobilePrefix}${i + 1}`
        const refCode = `ACH25-${role.substring(0, 1)}${i + 1}`
        const yearBenefit = SLABS[referralCount as keyof typeof SLABS] || 0
        const longTermBenefit = 15 + (referralCount * 5)

        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { mobileNumber: mobile },
                    { referralCode: refCode }
                ]
            }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    fullName: name,
                    mobileNumber: mobile,
                    password: '123456',
                    role: role as any,
                    childInHeguru: true,
                    referralCode: refCode,
                    confirmedReferralCount: referralCount,
                    yearFeeBenefitPercent: yearBenefit,
                    longTermBenefitPercent: longTermBenefit,
                    isFiveStarMember: true,
                    benefitStatus: 'Active',
                    studentFee: 60000,
                    academicYear: '2025-2026'
                }
            })
            console.log(`Created ${role} ${name}`)
        } else {
            console.log(`Skipped ${role} ${name} (already exists)`)
        }

        await generateLeads(user.userId, referralCount)
        await generateSettlements(user.userId)
    }
}

async function generateLeads(userId: number, count: number) {
    await prisma.referralLead.deleteMany({ where: { userId } })

    const seededCampuses = await prisma.campus.findMany()
    const campusNames = seededCampuses.map(c => c.campusName)
    const grades = ["INFANT&TODDLER (0 to 3 Yrs)", "INFANT&TODDLER (3 to 6 Yrs)", "PRESCHOOL 1", "PRESCHOOL 2", "PRIMARY"]

    for (let i = 0; i < count; i++) {
        const campusName = campusNames[i % campusNames.length]
        const campus = seededCampuses.find(c => c.campusName === campusName)
        const grade = grades[i % grades.length]
        const randomName = LEAD_NAMES[(userId + i) % LEAD_NAMES.length]

        await prisma.referralLead.create({
            data: {
                parentName: randomName,
                parentMobile: `98${String(userId).padStart(4, '0')}${String(i).padStart(4, '0')}`.substring(0, 10), // Ensure 10 digits
                campus: campusName,
                campusId: campus?.id,
                gradeInterested: grade,
                leadStatus: 'Confirmed',
                userId: userId,
                confirmedDate: new Date(),
                admittedYear: "2025-2026"
            }
        })
    }
}

async function generateSettlements(userId: number) {
    await prisma.settlement.deleteMany({ where: { userId } })

    const amounts = [5000, 12000, 2500]

    await prisma.settlement.create({
        data: {
            userId: userId,
            amount: amounts[userId % 3],
            status: 'Pending',
            remarks: 'Referral Bonus Q1'
        }
    })

    if (userId % 2 === 0) {
        await prisma.settlement.create({
            data: {
                userId: userId,
                amount: 1500,
                status: 'Processed',
                paymentMethod: 'NEFT',
                processedBy: 1,
                payoutDate: new Date()
            }
        })
    }
}

const CHILD_FIRST_NAMES = [
    "Arjun", "Priya", "Rahul", "Ananya", "Karthik",
    "Sneha", "Aditya", "Meera", "Vikram Jr", "Divya",
    "Rohan", "Kavya", "Sanjay", "Pooja", "Nikhil",
    "Aarav", "Ishaan", "Vihaan", "Aditi", "Saanvi",
    "Diya", "Aadhya", "Reyansh", "Pihu", "Anvi",
    "Krishna", "Lakshmi", "Riya", "Tanvi", "Arnav"
]

async function generateStudents() {
    console.log('Generating students...')

    await prisma.student.deleteMany({})

    const parents = await prisma.user.findMany({
        where: { role: 'Parent' },
        orderBy: { userId: 'asc' }
    })

    const campuses = await prisma.campus.findMany()
    const GRADES = ["INFANT&TODDLER (0 to 3 Yrs)", "INFANT&TODDLER (3 to 6 Yrs)", "PRESCHOOL 1", "PRESCHOOL 2", "PRIMARY"]
    const SECTIONS = ['A', 'B', 'C']

    let studentIndex = 0
    let childNameIndex = 0

    for (let parentIndex = 0; parentIndex < parents.length; parentIndex++) {
        const parent = parents[parentIndex]
        const numStudents = parentIndex + 1

        const parentNameParts = parent.fullName.split(' ')
        const parentSurname = parentNameParts[parentNameParts.length - 1]

        for (let i = 0; i < numStudents && childNameIndex < CHILD_FIRST_NAMES.length; i++) {
            const campus = campuses[studentIndex % campuses.length]
            const grade = GRADES[studentIndex % GRADES.length]
            const section = SECTIONS[studentIndex % SECTIONS.length]

            const dummyParentName = `Parent of ${CHILD_FIRST_NAMES[childNameIndex]}`
            const dummyMobile = `80000${String(studentIndex).padStart(5, '0')}`

            let dummyParent = await prisma.user.findUnique({ where: { mobileNumber: dummyMobile } })

            if (!dummyParent) {
                dummyParent = await prisma.user.create({
                    data: {
                        fullName: dummyParentName,
                        mobileNumber: dummyMobile,
                        role: 'Parent',
                        childInHeguru: true,
                        referralCode: `PAR-REF-${studentIndex}`,
                        confirmedReferralCount: 0,
                        yearFeeBenefitPercent: 0,
                        longTermBenefitPercent: 0,
                        isFiveStarMember: false,
                        benefitStatus: 'Inactive',
                        studentFee: 60000,
                        academicYear: '2025-2026'
                    }
                })
            }

            const studentFullName = `${CHILD_FIRST_NAMES[childNameIndex]} ${parentSurname}`

            let baseFee = 60000
            const gradeFee = await prisma.gradeFee.findFirst({
                where: { campusId: campus.id, grade: grade }
            })
            if (gradeFee) baseFee = gradeFee.annualFee_otp || 0

            await prisma.student.create({
                data: {
                    fullName: studentFullName,
                    parentId: dummyParent.userId,
                    ambassadorId: parent.userId,
                    campusId: campus.id,
                    grade: grade,
                    section: section,
                    rollNumber: `R${2024}${String(studentIndex + 1).padStart(3, '0')}`,
                    baseFee: baseFee,
                    discountPercent: parent.yearFeeBenefitPercent || 0,
                    status: 'Active'
                }
            })

            console.log(`Created student: ${studentFullName} for ambassador (parent) ${parent.fullName}`)
            studentIndex++
            childNameIndex++
        }
    }

    const staffUsers = await prisma.user.findMany({
        where: { role: 'Staff' },
        orderBy: { userId: 'asc' }
    })

    for (let staffIndex = 0; staffIndex < staffUsers.length; staffIndex++) {
        const staff = staffUsers[staffIndex]
        const numStudents = staffIndex + 1

        const staffNameParts = staff.fullName.split(' ')
        const staffSurname = staffNameParts[staffNameParts.length - 1]

        for (let i = 0; i < numStudents && childNameIndex < CHILD_FIRST_NAMES.length; i++) {
            const campus = campuses[studentIndex % campuses.length]
            const grade = GRADES[studentIndex % GRADES.length]
            const section = SECTIONS[studentIndex % SECTIONS.length]

            const dummyParentName = `Parent of ${CHILD_FIRST_NAMES[childNameIndex]}`
            const dummyMobile = `90000${String(studentIndex).padStart(5, '0')}`

            let dummyParent = await prisma.user.findUnique({ where: { mobileNumber: dummyMobile } })

            if (!dummyParent) {
                dummyParent = await prisma.user.create({
                    data: {
                        fullName: dummyParentName,
                        mobileNumber: dummyMobile,
                        role: 'Parent',
                        childInHeguru: true,
                        referralCode: `PAR-TEMP-${studentIndex}`,
                        confirmedReferralCount: 0,
                        yearFeeBenefitPercent: 0,
                        longTermBenefitPercent: 0,
                        isFiveStarMember: false,
                        benefitStatus: 'Inactive',
                        studentFee: 60000,
                        academicYear: '2025-2026'
                    }
                })
            }

            const studentFullName = `${CHILD_FIRST_NAMES[childNameIndex]} ${staffSurname}`

            let baseFee = 60000
            const gradeFee = await prisma.gradeFee.findFirst({
                where: { campusId: campus.id, grade: grade }
            })
            if (gradeFee) baseFee = gradeFee.annualFee_otp || 0

            await prisma.student.create({
                data: {
                    fullName: studentFullName,
                    parentId: dummyParent.userId,
                    ambassadorId: staff.userId,
                    campusId: campus.id,
                    grade: grade,
                    section: section,
                    rollNumber: `R${2024}${String(studentIndex + 1).padStart(3, '0')}`,
                    baseFee: baseFee,
                    discountPercent: staff.yearFeeBenefitPercent || 0,
                    status: 'Active'
                }
            })

            console.log(`Created student: ${studentFullName} for ambassador (staff) ${staff.fullName}`)
            studentIndex++
            childNameIndex++
        }
    }

    console.log(`Total students created: ${studentIndex}`)
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
