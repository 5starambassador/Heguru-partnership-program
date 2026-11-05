import prisma from '@/lib/prisma'

const MAX_OTP_ATTEMPTS = 5
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000
const VERIFIED_WINDOW_MS = 30 * 60 * 1000

const attemptKey = (mobile: string) => `verify:otp:${mobile}`
const verifiedKey = (mobile: string) => `otp:verified:${mobile}`

/**
 * Counts an OTP attempt before the code is compared, so parallel guesses cannot
 * slip past the limit. Call clearOtpAttempts after a correct code.
 */
export async function reserveOtpAttempt(mobile: string): Promise<{ allowed: true } | { allowed: false; error: string }> {
    const key = attemptKey(mobile)
    const now = new Date()

    await prisma.rateLimit.deleteMany({ where: { key, resetAt: { lte: now } } })

    const attempts = await prisma.rateLimit.upsert({
        where: { key },
        update: { count: { increment: 1 } },
        create: { key, count: 1, resetAt: new Date(now.getTime() + ATTEMPT_WINDOW_MS) }
    })

    if (attempts.count > MAX_OTP_ATTEMPTS) {
        const minutesLeft = Math.ceil((attempts.resetAt.getTime() - now.getTime()) / 60000)
        return { allowed: false, error: `Too many failed attempts. Please try again in ${minutesLeft} minutes.` }
    }

    return { allowed: true }
}

export async function clearOtpAttempts(mobile: string) {
    await prisma.rateLimit.deleteMany({ where: { key: attemptKey(mobile) } })
}

/** Records that this mobile passed OTP verification, so registration can trust it on the server. */
export async function markMobileVerified(mobile: string) {
    const key = verifiedKey(mobile)
    const resetAt = new Date(Date.now() + VERIFIED_WINDOW_MS)

    await prisma.rateLimit.upsert({
        where: { key },
        update: { resetAt },
        create: { key, count: 1, resetAt }
    })
}

export async function isMobileVerified(mobile: string): Promise<boolean> {
    const record = await prisma.rateLimit.findUnique({ where: { key: verifiedKey(mobile) } })
    return !!record && record.resetAt > new Date()
}

export async function clearMobileVerified(mobile: string) {
    await prisma.rateLimit.deleteMany({ where: { key: verifiedKey(mobile) } })
}
