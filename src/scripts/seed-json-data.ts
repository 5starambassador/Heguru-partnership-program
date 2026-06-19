import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

function parseDate(val: any): Date {
    if (!val) return new Date()
    const d = new Date(val)
    if (isNaN(d.getTime())) return new Date()
    return d
}

function mapAdminRole(role: string): any {
    switch (role) {
        case 'Super Admin':
            return 'Super_Admin'
        case 'Finance Admin':
            return 'Finance_Admin'
        case 'Campus Head':
            return 'Campus_Head'
        case 'Admission Admin':
            return 'Admission_Admin'
        case 'Campus Admin':
            return 'Campus_Admin'
        default:
            return role
    }
}

async function main() {
    console.log('🚀 Starting JSON Seeding Script...')

    // 1. AcademicYear
    console.log('Seeding AcademicYear...')
    const academicYears = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'src/seed/AcademicYear.json'), 'utf8')
    )
    for (const item of academicYears) {
        const data = {
            year: item.year,
            startDate: parseDate(item.startDate),
            endDate: parseDate(item.endDate),
            isActive: item.isActive,
            isCurrent: item.isCurrent,
            createdAt: parseDate(item.createdAt),
            updatedAt: parseDate(item.updatedAt),
        }
        await prisma.academicYear.upsert({
            where: { id: item.id },
            update: data,
            create: { id: item.id, ...data },
        })
    }
    console.log(`✓ Seeded ${academicYears.length} AcademicYears`)

    // 2. Campus
    console.log('Seeding Campus...')
    const campuses = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'src/seed/Campus.json'), 'utf8')
    )
    for (const item of campuses) {
        const data = {
            campusName: item.campusName,
            campusCode: item.campusCode,
            location: item.location,
            grades: item.grades,
            maxCapacity: item.maxCapacity ?? 500,
            currentEnrollment: item.currentEnrollment ?? 0,
            isActive: item.isActive ?? true,
            campusHeadId: item.campusHeadId,
            contactEmail: item.contactEmail,
            contactPhone: item.contactPhone,
            address: item.address,
            createdAt: parseDate(item.createdAt),
            updatedAt: parseDate(item.updatedAt),
        }
        await prisma.campus.upsert({
            where: { id: item.id },
            update: data,
            create: { id: item.id, ...data },
        })
    }
    console.log(`✓ Seeded ${campuses.length} Campuses`)

    // 3. Admin
    console.log('Seeding Admin...')
    const admins = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'src/seed/Admin.json'), 'utf8')
    )
    for (const item of admins) {
        const data = {
            adminName: item.adminName,
            adminMobile: item.adminMobile,
            assignedCampus: item.assignedCampus,
            createdAt: parseDate(item.createdAt),
            profileImage: item.profileImage,
            email: item.email,
            address: item.address,
            password: item.password,
            role: mapAdminRole(item.role),
            status: item.status,
        }
        await prisma.admin.upsert({
            where: { adminId: item.adminId },
            update: data,
            create: { adminId: item.adminId, ...data },
        })
    }
    console.log(`✓ Seeded ${admins.length} Admins`)

    // 4. NotificationSettings
    console.log('Seeding NotificationSettings...')
    const notificationSettingsList = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'src/seed/NotificationSettings.json'), 'utf8')
    )
    for (const item of notificationSettingsList) {
        const data = {
            emailNotifications: item.emailNotifications,
            smsNotifications: item.smsNotifications,
            whatsappNotifications: item.whatsappNotifications,
            leadFollowupReminders: item.leadFollowupReminders,
            reminderFrequencyDays: item.reminderFrequencyDays,
            notifySuperAdminOnNewAdmins: item.notifySuperAdminOnNewAdmins,
            notifyCampusHeadOnNewLeads: item.notifyCampusHeadOnNewLeads,
            updatedAt: parseDate(item.updatedAt),
            updatedBy: item.updatedBy,
        }
        await prisma.notificationSettings.upsert({
            where: { id: item.id },
            update: data,
            create: { id: item.id, ...data },
        })
    }
    console.log(`✓ Seeded ${notificationSettingsList.length} NotificationSettings`)

    // 5. RolePermissions
    console.log('Seeding RolePermissions...')
    const rolePermissionsList = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'src/seed/RolePermissions.json'), 'utf8')
    )
    for (const item of rolePermissionsList) {
        const { id, ...dataWithoutId } = item
        if (dataWithoutId.updatedAt) {
            dataWithoutId.updatedAt = parseDate(dataWithoutId.updatedAt)
        }
        await prisma.rolePermissions.upsert({
            where: { id: item.id },
            update: dataWithoutId,
            create: { id: item.id, ...dataWithoutId },
        })
    }
    console.log(`✓ Seeded ${rolePermissionsList.length} RolePermissions`)

    // 6. SecuritySettings
    console.log('Seeding SecuritySettings...')
    const securitySettingsList = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'src/seed/SecuritySettings.json'), 'utf8')
    )
    for (const item of securitySettingsList) {
        const data = {
            sessionTimeoutMinutes: item.sessionTimeoutMinutes,
            maxLoginAttempts: item.maxLoginAttempts,
            passwordResetExpiryHours: item.passwordResetExpiryHours,
            twoFactorAuthEnabled: item.twoFactorAuthEnabled,
            updatedAt: parseDate(item.updatedAt),
            updatedBy: item.updatedBy,
            ipWhitelist: item.ipWhitelist,
        }
        await prisma.securitySettings.upsert({
            where: { id: item.id },
            update: data,
            create: { id: item.id, ...data },
        })
    }
    console.log(`✓ Seeded ${securitySettingsList.length} SecuritySettings`)

    // 7. SystemSettings
    console.log('Seeding SystemSettings...')
    const systemSettingsList = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'src/seed/SystemSettings.json'), 'utf8')
    )
    for (const item of systemSettingsList) {
        const data = {
            allowNewRegistrations: item.allowNewRegistrations,
            defaultStudentFee: item.defaultStudentFee,
            maintenanceMode: item.maintenanceMode,
            staffReferralText: item.staffReferralText,
            parentReferralText: item.parentReferralText,
            staffWelcomeMessage: item.staffWelcomeMessage,
            parentWelcomeMessage: item.parentWelcomeMessage,
            updatedAt: parseDate(item.updatedAt),
            updatedBy: item.updatedBy,
            alumniReferralText: item.alumniReferralText,
            alumniWelcomeMessage: item.alumniWelcomeMessage,
            allowManualPayments: item.allowManualPayments,
            activeOnlineGateway: item.activeOnlineGateway,
        }
        await prisma.systemSettings.upsert({
            where: { id: item.id },
            update: data,
            create: { id: item.id, ...data },
        })
    }
    console.log(`✓ Seeded ${systemSettingsList.length} SystemSettings`)

    // 8. WhatsAppConfig
    console.log('Seeding WhatsAppConfig...')
    const whatsAppConfigList = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'src/seed/WhatsAppConfig.json'), 'utf8')
    )
    for (const item of whatsAppConfigList) {
        const data = {
            eventKey: item.eventKey,
            templateName: item.templateName,
            templateBody: item.templateBody,
            isEnabled: item.isEnabled,
            description: item.description,
            updatedAt: parseDate(item.updatedAt),
            requiredVariablesCount: item.requiredVariablesCount,
            ruleConfig: item.ruleConfig,
        }
        await prisma.whatsAppConfig.upsert({
            where: { id: item.id },
            update: data,
            create: { id: item.id, ...data },
        })
    }
    console.log(`✓ Seeded ${whatsAppConfigList.length} WhatsAppConfigs`)

    console.log('🏁 JSON Seeding completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error during JSON seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
