import 'server-only'
import { getSession } from './session'
import prisma, { withRetry } from './prisma'
import { cache } from 'react'

import { mapAdminRole, mapUserRole } from './enum-utils'

export const getCurrentUser = cache(async () => {
    const session: any = await getSession()
    if (!session || !session.userId) return null

    try {
        if (session.userType === 'admin') {
            const admin = await withRetry(() => prisma.admin.findUnique({
                where: { adminId: Number(session.userId) }
            }))
            if (admin) {
                // Resolve campusId if assignedCampus is present (Critical for permission scoping)
                let campusId = null
                if (admin.assignedCampus) {
                    const campus = await withRetry(() => prisma.campus.findUnique({
                        where: { campusName: admin.assignedCampus! },
                        select: { id: true, isActive: true }
                    }))
                    if (campus) {
                        // BLOCK LOGIN IF CAMPUS IS INACTIVE
                        if (!campus.isActive && String(admin.role) !== 'Super Admin') {
                            return null
                        }
                        campusId = campus.id
                    }
                }

                // Map to User-like structure for compatibility
                return {
                    ...admin,
                    userId: admin.adminId,
                    campusId,
                    fullName: admin.adminName,
                    mobileNumber: admin.adminMobile,
                    role: mapAdminRole(admin.role)
                }
            }
        }

        const user = await withRetry(() => prisma.user.findUnique({
            where: { userId: Number(session.userId) }
        }))

        if (user) {
            let finalUser = {
                ...user,
                role: mapUserRole(user.role)
            }

            if (!user.assignedCampus && user.campusId) {
                const campus = await withRetry(() => prisma.campus.findUnique({
                    where: { id: user.campusId! },
                    select: { campusName: true }
                }))
                if (campus) {
                    finalUser = { ...finalUser, assignedCampus: campus.campusName }
                }
            }
            return finalUser
        }
    } catch (dbError) {
        console.warn('getCurrentUser: Database unreachable (Possible Quota Limit). Using session-only fallback.', (dbError as any).message)
        // EMERGENCY FALLBACK: Construct a minimal user object from session data 
        // to allow layout rendering and basic navigation while DB is down.
        return {
            userId: Number(session.userId),
            role: session.role || (session.userType === 'admin' ? 'Campus Admin' : 'Ambassador'),
            fullName: 'User (Limited Mode)',
            mobileNumber: '',
            type: session.userType,
            assignedCampus: null, // Critical for type compatibility in other actions
            currentYearCount: 0,
            status: session.status,
            isDegraded: true // Flag for UI to show "Limited Mode" if needed
        }
    }

    return null
})
