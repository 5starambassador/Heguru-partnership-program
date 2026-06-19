import type { BenefitSlabData } from '@/types/benefit'
import { REWARD_RATES } from './reward-constants'

export const DEBUG_LOGS: string[] = []

export interface ReferralData {
    id: number
    studentName?: string
    parentName?: string
    admissionNumber?: string
    campusId: number
    campusName?: string
    grade: string
    actualFee?: number
    campusGrade1Fee?: number
    admissionFeeCollected?: number
    donationFeeCollected?: number
    specialBonusRate?: number
    createdAt?: Date | string
    confirmedDate?: Date | string | null
    studentCreatedAt?: Date | string | null
    feeDataMissing?: boolean
    paymentCycle?: string
}

export interface UserContext {
    role: 'Parent' | 'Staff' | 'Alumni' | 'Others'
    childInHeguru?: boolean
    studentFee?: number
    isFiveStarLastYear?: boolean
    previousYearReferrals?: ReferralData[]
}

/**
 * Calculates the Total Benefit Amount according to current institutional protocol.
 */
export function calculateTotalBenefit(
    currentReferrals: ReferralData[],
    user: UserContext,
    slabs: BenefitSlabData[],
    forceActivateLongTerm: boolean = false
): {
    totalAmount: number,
    breakdown: string[],
    isLongActive: boolean,
    longTermBaseAmount: number,
    currentYearAmount: number,
    tierPercent: number,
    admissionShare: number,
    donationShare: number,
    slabShare: number,
    specialBonusShare: number,
    appBonusPercent?: number
} {
    const referralCount = currentReferrals.length
    const isGroupAWaiver = (user.role === 'Parent' || user.role === 'Staff') && !!user.childInHeguru

    if (referralCount > 0) {
        DEBUG_LOGS.push(`[DEBUG] Calculating benefit for role: ${user.role}, childInHeguru: ${user.childInHeguru}, referrals: ${referralCount}`);
    }

    let breakdown: string[] = []
    let totalWaiver = 0
    let totalPayout = 0

    currentReferrals.forEach((ref) => {
        const annualFee = ref.actualFee || ref.campusGrade1Fee || 0
        const isMonthly = ref.paymentCycle === 'MONTHLY'
        const oneMonthFee = isMonthly ? annualFee : Math.round(annualFee / 12)

        const studentLabel = ref.studentName ? `${ref.studentName}` : `Lead ID ${ref.id}`
        const gradeLabel = ref.grade ? ` (${ref.grade})` : ''

        if (isGroupAWaiver) {
            totalWaiver += oneMonthFee
            breakdown.push(`⚡ FEE WAIVER: One-Month Fee Reward for referring ${studentLabel}${gradeLabel} = ₹${oneMonthFee.toLocaleString('en-IN')}`)
        } else {
            totalPayout += oneMonthFee
            breakdown.push(`🔥 PAYOUT: One-Month Fee Reward for referring ${studentLabel}${gradeLabel} = ₹${oneMonthFee.toLocaleString('en-IN')}`)
        }
    })

    const slabShare = isGroupAWaiver ? totalWaiver : 0
    const admissionShare = isGroupAWaiver ? 0 : totalPayout
    const donationShare = 0
    const specialBonusShare = 0
    const longTermBaseAmount = 0
    const totalAmount = slabShare + admissionShare

    return {
        totalAmount,
        breakdown,
        isLongActive: false,
        longTermBaseAmount,
        currentYearAmount: totalAmount,
        tierPercent: 0,
        admissionShare,
        donationShare,
        slabShare,
        specialBonusShare,
        appBonusPercent: 0
    }
}
