import { getMyReferrals } from "@/app/referral-actions";
import { getCurrentUser } from "@/lib/auth-service";
import { getBenefitSlabs } from "@/app/benefit-actions";
import prisma from "@/lib/prisma";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ReferralsList } from "./referrals-list";

export default async function ReferralsPage() {
  const [referrals, user, slabsResult, activeYears, settlements] =
    await Promise.all([
      getMyReferrals(),
      getCurrentUser(),
      getBenefitSlabs(),
      prisma.academicYear.findMany({ where: { isActive: true } }),
      prisma.settlement.findMany({
        where: { userId: (await getCurrentUser())?.userId },
        include: { referralLead: true },
      }),
    ]);

  // Prepare Campus Fee Map for accurate yield calculations (mirroring DashboardClient)
  const activeYearStrings = activeYears.map((y) => y.year);
  const campusIds = Array.from(
    new Set(referrals.map((r: any) => r.campusId).filter(Boolean)),
  ) as number[];
  const grade1Fees = await prisma.gradeFee.findMany({
    where: {
      campusId: { in: campusIds },
      grade: { in: ["Grade 1", "Grade - 1", "1", "I"] },
      academicYear: { in: activeYearStrings },
    },
  });
  const campusFeeMap: Record<
    string,
    Record<number, { otp: number; wotp: number }>
  > = {};
  activeYearStrings.forEach((y) => {
    campusFeeMap[y] = {};
  });
  grade1Fees.forEach((gf) => {
    if (!campusFeeMap[gf.academicYear]) campusFeeMap[gf.academicYear] = {};
    campusFeeMap[gf.academicYear][gf.campusId] = {
      otp: gf.annualFee_otp || 0,
      wotp: gf.annualFee_wotp || 0,
    };
  });

  return (
    <div className="relative mt-5">
      <div className="max-w-[1400px] mx-auto flex flex-col">
        <Link
          href="/dashboard"
          className="w-max px-4 mb-8 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center gap-1.5 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 shadow-sm group"
        >
          <ArrowLeft
            size={18}
            className="text-gray-600 group-hover:text-gray-700 transition-colors"
          />
          <span className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
            Back
          </span>
        </Link>

        <ReferralsList
          referrals={referrals}
          user={user}
          slabs={slabsResult.success ? slabsResult.data || [] : []}
          activeYears={activeYears}
          settlements={settlements}
          campusFeeMap={campusFeeMap}
        />
      </div>
    </div>
  );
}
