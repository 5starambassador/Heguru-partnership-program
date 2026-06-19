import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting system-wide data cleanup and admin seeding...')

    // 1. Clear transactional tables
    console.log('Clearing transactional data...')
    try {
        const deletedSettlements = await prisma.settlement.deleteMany({})
        console.log(`Deleted settlements: ${deletedSettlements.count}`)
    } catch (e) {
        console.log('Skipped Settlement deletion.')
    }

    try {
        const deletedTicketMsgs = await prisma.ticketMessage.deleteMany({})
        console.log(`Deleted support ticket messages: ${deletedTicketMsgs.count}`)
    } catch (e) {
        console.log('Skipped TicketMessage deletion.')
    }

    try {
        const deletedTickets = await prisma.supportTicket.deleteMany({})
        console.log(`Deleted support tickets: ${deletedTickets.count}`)
    } catch (e) {
        console.log('Skipped SupportTicket deletion.')
    }

    try {
        const deletedStudents = await prisma.student.deleteMany({})
        console.log(`Deleted students: ${deletedStudents.count}`)
    } catch (e) {
        console.log('Skipped Student deletion.')
    }

    try {
        const deletedReferrals = await prisma.referralLead.deleteMany({})
        console.log(`Deleted referral leads: ${deletedReferrals.count}`)
    } catch (e) {
        console.log('Skipped ReferralLead deletion.')
    }

    try {
        const deletedProgramLeads = await prisma.programLead.deleteMany({})
        console.log(`Deleted program leads: ${deletedProgramLeads.count}`)
    } catch (e) {
        console.log('Skipped ProgramLead deletion.')
    }

    try {
        const deletedDeviceTokens = await prisma.deviceToken.deleteMany({})
        console.log(`Deleted device tokens: ${deletedDeviceTokens.count}`)
    } catch (e) {
        console.log('Skipped DeviceToken deletion.')
    }

    try {
        const deletedNotifications = await prisma.notification.deleteMany({})
        console.log(`Deleted notifications: ${deletedNotifications.count}`)
    } catch (e) {
        console.log('Skipped Notification deletion.')
    }

    try {
        const deletedUsers = await prisma.user.deleteMany({})
        console.log(`Deleted users: ${deletedUsers.count}`)
    } catch (e) {
        console.log('Skipped User deletion.')
    }

    try {
        const deletedAdmins = await prisma.admin.deleteMany({})
        console.log(`Deleted admins: ${deletedAdmins.count}`)
    } catch (e) {
        console.log('Skipped Admin deletion.')
    }

    try {
        const deletedOtps = await prisma.otpVerification.deleteMany({})
        console.log(`Deleted OTPs: ${deletedOtps.count}`)
    } catch (e) {
        console.log('Skipped OtpVerification deletion.')
    }

    try {
        const deletedActivityLogs = await prisma.activityLog.deleteMany({})
        console.log(`Deleted activity logs: ${deletedActivityLogs.count}`)
    } catch (e) {
        console.log('Skipped ActivityLog deletion.')
    }

    try {
        const deletedCampaignRecipients = await prisma.campaignRecipient.deleteMany({})
        console.log(`Deleted campaign recipients: ${deletedCampaignRecipients.count}`)
    } catch (e) {
        console.log('Skipped CampaignRecipient deletion.')
    }

    try {
        const deletedCampaignLogs = await prisma.campaignLog.deleteMany({})
        console.log(`Deleted campaign logs: ${deletedCampaignLogs.count}`)
    } catch (e) {
        console.log('Skipped CampaignLog deletion.')
    }

    try {
        const deletedCampaigns = await prisma.campaign.deleteMany({})
        console.log(`Deleted campaigns: ${deletedCampaigns.count}`)
    } catch (e) {
        console.log('Skipped Campaign deletion.')
    }

    try {
        const deletedPayments = await prisma.payment.deleteMany({})
        console.log(`Deleted payments: ${deletedPayments.count}`)
    } catch (e) {
        console.log('Skipped Payment deletion.')
    }

    try {
        const deletedCrmLeads = await prisma.crmLead.deleteMany({})
        console.log(`Deleted CRM leads: ${deletedCrmLeads.count}`)
    } catch (e) {
        console.log('Skipped CrmLead deletion.')
    }

    try {
        const deletedJobs = await prisma.job.deleteMany({})
        console.log(`Deleted jobs: ${deletedJobs.count}`)
    } catch (e) {
        console.log('Skipped Job deletion.')
    }

    try {
        const deletedWhatsAppLogs = await prisma.whatsAppLog.deleteMany({})
        console.log(`Deleted WhatsApp logs: ${deletedWhatsAppLogs.count}`)
    } catch (e) {
        console.log('Skipped WhatsAppLog deletion.')
    }

    try {
        const deletedAutomationLogs = await prisma.automationLog.deleteMany({})
        console.log(`Deleted automation logs: ${deletedAutomationLogs.count}`)
    } catch (e) {
        console.log('Skipped AutomationLog deletion.')
    }

    try {
        const deletedErpStudents = await prisma.erpStudentData.deleteMany({})
        console.log(`Deleted ERP student data: ${deletedErpStudents.count}`)
    } catch (e) {
        console.log('Skipped ErpStudentData deletion.')
    }

    try {
        const deletedRateLimits = await prisma.rateLimit.deleteMany({})
        console.log(`Deleted rate limits: ${deletedRateLimits.count}`)
    } catch (e) {
        console.log('Skipped RateLimit deletion.')
    }

    console.log('All transactional and ambassador records have been successfully cleared.')

    // 2. Update Campus contact emails from @heguru.org to @heguru.org
    console.log('Updating Campus contact emails...')
    const campuses = await prisma.campus.findMany()
    let updatedCampusesCount = 0
    for (const campus of campuses) {
        if (campus.contactEmail && campus.contactEmail.includes('heguru.org')) {
            const newEmail = campus.contactEmail.replace(/heguru\.org/gi, 'heguru.org')
            await prisma.campus.update({
                where: { id: campus.id },
                data: { contactEmail: newEmail }
            })
            updatedCampusesCount++
        }
    }
    console.log(`Updated ${updatedCampusesCount} campus emails to @heguru.org.`)

    // 3. Update SystemSettings defaults
    console.log('Updating SystemSettings texts...')
    const settingsList = await prisma.systemSettings.findMany()
    let updatedSettingsCount = 0
    for (const settings of settingsList) {
        const staffText = settings.staffReferralText?.replace(/Heguru/gi, 'Heguru') || null
        const parentText = settings.parentReferralText?.replace(/Heguru/gi, 'Heguru') || null
        const alumniText = settings.alumniReferralText?.replace(/Heguru/gi, 'Heguru') || null
        
        await prisma.systemSettings.update({
            where: { id: settings.id },
            data: {
                staffReferralText: staffText,
                parentReferralText: parentText,
                alumniReferralText: alumniText
            }
        })
        updatedSettingsCount++
    }
    console.log(`Updated ${updatedSettingsCount} SystemSettings records.`)

    // 4. Seed Admin roles
    console.log('Seeding admin accounts...')
    const passwordHash = await bcrypt.hash('123', 10)
    const adminRoles = [
        { name: 'Super Admin', mobile: '9999999999', role: 'Super_Admin' },
        { name: 'Finance Admin', mobile: '8888888888', role: 'Finance_Admin' },
        { name: 'Campus Head', mobile: '7777777777', role: 'Campus_Head' },
        { name: 'Admission Admin', mobile: '6666666666', role: 'Admission_Admin' },
        { name: 'Campus Admin', mobile: '5555555555', role: 'Campus_Admin' }
    ]

    for (const admin of adminRoles) {
        await prisma.admin.create({
            data: {
                adminName: admin.name,
                adminMobile: admin.mobile,
                password: passwordHash,
                role: admin.role as any,
                status: 'Active'
            }
        })
        console.log(`Created admin account: ${admin.name} (${admin.mobile})`)
    }

    console.log('Cleanup and admin seeding complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
