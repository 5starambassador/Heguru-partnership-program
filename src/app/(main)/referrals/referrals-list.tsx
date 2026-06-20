"use client";

import { useState, useRef } from "react";
import { PageAnimate } from "@/components/PageAnimate";
import {
  CheckCircle2,
  Clock,
  MapPin,
  GraduationCap,
  User,
  Filter,
  ChevronDown,
  Star,
  Phone,
  Hash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "@/hooks/use-click-outside";

import { calculateTotalBenefit, UserContext } from "@/lib/benefit-calculator";

interface ReferralsListProps {
  referrals: any[];
  user: any;
  slabs: any[];
  activeYears: any[];
  settlements: any[];
  campusFeeMap?: Record<string, Record<number, { otp: number; wotp: number }>>;
}

export function ReferralsList({
  referrals,
  user,
  slabs,
  activeYears,
  settlements,
  campusFeeMap,
}: ReferralsListProps) {
  const sortedYears = [...activeYears].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
  const currentYearRecord =
    activeYears.find((y) => y.isCurrent) || sortedYears[0];
  const dropdownYears = [...sortedYears.map((y) => y.year), "All Time"];

  const [selectedYear, setSelectedYear] = useState(
    currentYearRecord?.year || "2025-2026",
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useClickOutside(filterRef, () => setIsFilterOpen(false));

  // Helper to determine academic year of a referral
  const getReferralYear = (r: any) => {
    if (r.admittedYear) return r.admittedYear;
    if (r.student?.academicYear) return r.student.academicYear;

    // Date-based fallback check
    const date = new Date(r.createdAt);
    const matchedYear = activeYears.find((y) => {
      const start = new Date(y.startDate);
      const end = new Date(y.endDate);
      return date >= start && date <= end;
    });

    return matchedYear?.year || currentYearRecord?.year || "2025-2026";
  };

  const filteredReferrals =
    selectedYear === "All Time"
      ? referrals
      : referrals.filter((r) => getReferralYear(r) === selectedYear);

  // Marginal Yield Logic (Type-Aware FIFO)
  const referralsWithYield = (() => {
    const sorted = [...filteredReferrals].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    const confirmed = sorted.filter(
      (r) => r.leadStatus === "Confirmed" || r.leadStatus === "Admitted",
    );
    const pending = sorted.filter(
      (r) =>
        !["Confirmed", "Admitted", "Rejected", "Closed"].includes(r.leadStatus),
    );
    const rejected = sorted.filter((r) =>
      ["Rejected", "Closed"].includes(r.leadStatus),
    );

    const context: UserContext = {
      role: (user?.role as any) || "Parent",
      childInHeguru: user?.childInHeguru,
      studentFee: user?.studentFee || 0,
      isFiveStarLastYear: user?.isFiveStarMember,
      previousYearReferrals: [], // Simplified for now
    };

    const format = (list: any[]) =>
      list.map((r) => {
        const rYear = getReferralYear(r);
        const g1Fee =
          campusFeeMap && campusFeeMap[rYear] && r.campusId
            ? campusFeeMap[rYear][r.campusId]?.wotp
            : 0;

        return {
          id: r.leadId,
          campusId: r.campusId || 0,
          campusName: r.campus,
          grade: r.gradeInterested,
          actualFee: r.student?.annualFee || r.annualFee || 0,
          campusGrade1Fee: g1Fee || 0,
          admissionFeeCollected: r.admissionFeeCollected || 0,
          donationFeeCollected: r.donationFeeCollected || 0,
          paymentCycle: r.paymentCycle || r.student?.paymentCycle,
        };
      });

    // --- PREPARE SETTLEMENT POOLS ---
    const validSettlements = (settlements || []).filter(
      (s: any) => s.status === "Processed",
    );
    let runningAdm = 0;
    let runningDon = 0;
    let runningSlab = 0;
    let runningGreedy = 0;

    const selectedYearRecord = activeYears.find((y) => y.year === selectedYear);

    validSettlements.forEach((s: any) => {
      const pDate = s.payoutDate
        ? new Date(s.payoutDate)
        : new Date(s.createdAt);
      const type = s.benefitType;

      // Heuristic for Jan-March 2026 Admission Shares
      const isFebMarchFuture =
        type === "ADMISSION_SHARE" &&
        pDate.getFullYear() === 2026 &&
        pDate.getMonth() <= 2;

      let yearOfAttribution = "";
      if (s.referralLead) {
        yearOfAttribution =
          s.referralLead.academicYear || s.referralLead.admittedYear;
      } else if (isFebMarchFuture) {
        yearOfAttribution = "2026-2027";
      } else {
        // Find matching year by date
        const matchedYear = activeYears.find((y) => {
          const sDate = new Date(y.startDate);
          const eDate = new Date(y.endDate);
          return pDate >= sDate && pDate <= eDate;
        });
        yearOfAttribution = matchedYear?.year || "2025-2026";
      }

      if (
        selectedYear !== "All Time" &&
        selectedYearRecord &&
        yearOfAttribution !== selectedYearRecord.year
      ) {
        return;
      }

      if (type === "ADMISSION_SHARE") runningAdm += s.amount || 0;
      else if (type === "DONATION_SHARE") runningDon += s.amount || 0;
      else if (type === "SLAB_SHARE") runningSlab += s.amount || 0;
      else runningGreedy += s.amount || 0;
    });

    const results: any[] = [];

    // 1. Calculate Secured Yields (Marginal) & Apply Granular FIFO
    let prevSecuredTotal = 0;
    let prevMetrics = {
      admissionShare: 0,
      donationShare: 0,
      slabShare: 0,
      specialBonusShare: 0,
    };

    // Pools for matching
    let remAdm = runningAdm;
    let remDon = runningDon;
    let remSlab = runningSlab;
    let remGreedy = runningGreedy;

    confirmed.forEach((r, i) => {
      const currentTotalMetrics = calculateTotalBenefit(
        format(confirmed.slice(0, i + 1)),
        context,
        slabs,
      );
      const currentTotal = currentTotalMetrics.totalAmount;
      const yieldAmount = currentTotal - prevSecuredTotal;

      // Calculate marginal components for this referral
      const mAdm =
        currentTotalMetrics.admissionShare - prevMetrics.admissionShare;
      const mDon =
        currentTotalMetrics.donationShare - prevMetrics.donationShare;
      const mSlab = currentTotalMetrics.slabShare - prevMetrics.slabShare;
      const mSpec =
        currentTotalMetrics.specialBonusShare - prevMetrics.specialBonusShare;

      // Match against pools
      let sAdm = Math.min(mAdm, remAdm);
      remAdm -= sAdm;
      let sDon = Math.min(mDon, remDon);
      remDon -= sDon;
      let sSlab = Math.min(mSlab, remSlab);
      remSlab -= sSlab;

      // Greedy match for Specials or remaining gaps
      let leftover = mAdm - sAdm + (mDon - sDon) + (mSlab - sSlab) + mSpec;
      let sGreedy = Math.min(leftover, remGreedy);
      remGreedy -= sGreedy;

      const settledForReferral = sAdm + sDon + sSlab + sGreedy;
      const isSettled = settledForReferral >= yieldAmount && yieldAmount > 0;
      const isPartial =
        settledForReferral > 0 && settledForReferral < yieldAmount;

      results.push({
        ...r,
        calculatedYield: yieldAmount,
        yieldType: "secured",
        isSettled,
        isPartial,
        settledAmount: settledForReferral,
      });

      prevSecuredTotal = currentTotal;
      prevMetrics = {
        admissionShare: currentTotalMetrics.admissionShare,
        donationShare: currentTotalMetrics.donationShare,
        slabShare: currentTotalMetrics.slabShare,
        specialBonusShare: currentTotalMetrics.specialBonusShare,
      };
    });

    // 2. Calculate Potential Yields (Marginal)
    let prevPotentialTotal = prevSecuredTotal;
    pending.forEach((r, i) => {
      const combined = [...confirmed, ...pending.slice(0, i + 1)];
      const currentTotal = calculateTotalBenefit(
        format(combined),
        context,
        slabs,
      ).totalAmount;
      const yieldAmount = currentTotal - prevPotentialTotal;
      results.push({
        ...r,
        calculatedYield: yieldAmount,
        yieldType: "potential",
      });
      prevPotentialTotal = currentTotal;
    });

    // 3. Rejected
    rejected.forEach((r) =>
      results.push({ ...r, calculatedYield: 0, yieldType: "none" }),
    );

    return results;
  })();

  const preAsset = referralsWithYield.filter(
    (r: any) => r.yieldType === "potential",
  );
  const asset = referralsWithYield.filter(
    (r: any) => r.yieldType === "secured" || r.leadStatus === "Rejected",
  );

  return (
    <div className="w-full relative">
      <div className="relative z-10 flex flex-col">
        <div className="md:flex-row flex-col justify-between items-center mb-12 relative z-50">
          <div className="flex mb-3 items-center gap-4">
            <div >
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[var(--deep-black)] uppercase font-heading">
                My Referrals
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.25em] mt-1">
                Your Royal Network
              </p>
            </div>
          </div>
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-full text-slate-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Filter size={12} className="text-[var(--primary-orange)]" />
              <span>Year: {selectedYear}</span>
              <ChevronDown
                size={12}
                className={`text-slate-400 transition-transform ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  {dropdownYears.map((year: string) => (
                    <button
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors ${
                        selectedYear === year
                          ? "text-[var(--primary-orange)] font-bold bg-[var(--primary-orange)]/[0.04]"
                          : "text-slate-600"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SECTION 1: PRE-ASSET */}
        <PageAnimate className="mb-10">
          <div className="flex items-center justify-between mb-6 pl-4 border-l-4 border-[var(--primary-orange)]/60">
            <div>
              <h2 className="text-lg font-black text-[var(--deep-black)] tracking-tight uppercase font-heading">
                Pre-Asset
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
                High-Potential Leads
              </p>
            </div>
            <span className="bg-[var(--primary-orange)]/15 border border-[var(--primary-orange)]/25 text-[var(--primary-orange)] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {preAsset.length} Lead{preAsset.length !== 1 ? "s" : ""}
            </span>
          </div>

          {preAsset.length === 0 ? (
            <div className="bg-white border border-gray-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <p className="text-slate-400 font-medium text-sm">
                No active leads for {selectedYear}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {preAsset.map((referral: any) => (
                <ReferralCard
                  key={referral.leadId}
                  referral={referral}
                  type="pre-asset"
                  user={user}
                />
              ))}
            </div>
          )}
        </PageAnimate>

        <hr className="border-gray-200 mb-7 mt-4" />

        {/* SECTION 2: ASSET */}
        <PageAnimate className="mb-10">
          <div className="flex items-center justify-between mb-6 pl-4 border-l-4 border-emerald-500/60">
            <div>
              <h2 className="text-lg font-black text-[var(--deep-black)] tracking-tight uppercase font-heading">
                Asset
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
                Secured Accomplishments
              </p>
            </div>
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {asset.length} Asset{asset.length !== 1 ? "s" : ""}
            </span>
          </div>

          {asset.length === 0 ? (
            <div className="bg-white border border-gray-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-400 font-medium text-sm">
                No asset referrals{" "}
                {selectedYear === "All Time" ? "yet" : `in ${selectedYear}`}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {asset.map((referral: any) => (
                <ReferralCard
                  key={referral.leadId}
                  referral={referral}
                  type="asset"
                  user={user}
                />
              ))}
            </div>
          )}
        </PageAnimate>
      </div>
    </div>
  );
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Confirmed":
    case "Admitted":
      return {
        text: "text-emerald-700 border-emerald-200 bg-emerald-50/70",
        dot: "bg-emerald-500",
      };
    case "Rejected":
    case "Closed":
      return {
        text: "text-rose-700 border-rose-200 bg-rose-50/70",
        dot: "bg-rose-500",
      };
    case "Contacted":
      return {
        text: "text-blue-700 border-blue-200 bg-blue-50/70",
        dot: "bg-blue-500",
      };
    case "Interested":
      return {
        text: "text-amber-700 border-amber-200 bg-amber-50/70",
        dot: "bg-amber-500",
      };
    default:
      return {
        text: "text-slate-700 border-slate-200 bg-slate-50/70",
        dot: "bg-slate-400",
      };
  }
};

function ReferralCard({
  referral,
  type,
  user,
}: {
  referral: any;
  type: "pre-asset" | "asset";
  user: any;
}) {
  const isAsset = type === "asset";
  const yieldAmount = referral.calculatedYield || 0;

  // WhatsApp Nudge Link
  const whatsappUrl = `https://wa.me/${
    referral.parentMobile
  }?text=${encodeURIComponent(
    `Hello! I'm *${
      user?.fullName || "an Ambassador"
    }*, an Ambassador from HEGURU. I'm reaching out regarding your referral for *${
      referral.studentName || "your child"
    }*. I'd love to share an update on the admission status!`,
  )}`;

  const statusStyle = getStatusStyle(referral.leadStatus);

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Subtle top border accent line */}
      <div
        className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent ${
          isAsset ? "via-emerald-500/30" : "via-[var(--primary-orange)]/30"
        } to-transparent opacity-80`}
      />

      {/* Yield Badge - Dashboard style */}
      <div
        className={`absolute top-0 right-6 px-4 py-1.5 rounded-b-xl border-x border-b font-black text-[9px] uppercase tracking-[0.15em] z-20 shadow-sm ${
          referral.isSettled || referral.isPartial
            ? "bg-blue-50 border-blue-100 text-blue-700"
            : referral.yieldType === "secured"
            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
            : "bg-amber-50 border-amber-100 text-amber-700"
        }`}
      >
        <div className="text-left sm:text-right">
          <p className="md:text-xs text-[9px] font-bold text-slate-600 mt-0.5">
            {new Date(referral.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </div>

      {/* Two Grid Layout (Split on large screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-stretch pt-2">
        {/* Left Grid */}
        <div className="flex-1 order-2 md:order-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* 1. Student Name */}
            <h3 className="font-heading mb-5 md:mt-0 mt-3 font-black text-md lg:text-3xl text-[var(--deep-black)] capitalize tracking-tight">
              {referral.studentName}
            </h3>

            {/* 2. Parent Name & Mobile Row */}
            <div className="flex md:flex-wrap flex-col md:items-center gap-x-6 gap-y-2 mb-4 text-[12px] font-semibold text-gray-600 capitalize tracking-wider">
              <span className="flex items-center gap-2">
                <User size={14} className="text-slate-400" />
                <span>Parent - </span>

                {referral.parentName}
              </span>
              <span className="md:block hidden">|</span>
              <span className="flex items-center gap-2">
                <Phone size={14} className="text-slate-400" />
                <span>Parent's Mobile - </span>
                +91 {referral.parentMobile}
              </span>
            </div>

            {/* 3. Student Grade, ERP, Campus Row */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-slate-50 px-3 py-1.5 rounded-xl border border-gray-200 flex items-center gap-2 text-[12px] font-medium text-slate-600 md:uppercase capitalize tracking-wider">
                <GraduationCap size={12} className="text-slate-400" />
                Grade: {referral.gradeInterested || "All Grades"}
              </span>
              <span className="bg-slate-50 px-3 py-1.5 rounded-xl border border-gray-200  flex items-center gap-2 text-[12px] font-medium text-slate-600 md:uppercase capitalize tracking-wider">
                <Hash size={12} className="text-slate-400" />
                ERP: {referral.admissionNumber || "Pending"}
              </span>
              <span className="bg-slate-50 px-3 py-1.5 rounded-xl border border-gray-200  flex items-center gap-2 text-[12px] font-medium text-slate-600 md:uppercase capitalize tracking-wider">
                <MapPin size={12} className="text-slate-400" />
                Campus: {referral.campus || "Corporate"}
              </span>
            </div>
          </div>

          {/* 4. Horizontal Divider */}
          <hr className="border-gray-200 my-5" />

          {/* 5. Financial Rewards Summary & Date */}
          <div className="flex flex-wrap items-center justify-between py-2 gap-6">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <div>
                <p className="text-[12px] font-semibold text-gray-600 uppercase tracking-widest">
                  Potential
                </p>
                <p className="text-lg lg:text-3xl font-black text-amber-600 mt-0.5">
                  ₹
                  {(referral.yieldType === "potential"
                    ? yieldAmount
                    : 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="hidden sm:block h-8 w-[1px] bg-slate-100" />
              <div>
                <p className="text-[12px] font-semibold text-gray-600 uppercase tracking-widest">
                  Secured
                </p>
                <p className="text-lg lg:text-3xl font-black text-emerald-600 mt-0.5">
                  ₹
                  {(referral.yieldType === "secured"
                    ? yieldAmount
                    : 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="hidden sm:block h-8 w-[1px] bg-slate-100" />
              <div>
                <p className="text-[12px] font-semibold text-gray-600 uppercase tracking-widest">
                  Settled
                </p>
                <p className="text-lg lg:text-3xl font-black text-blue-600 mt-0.5">
                  ₹
                  {(referral.isPartial
                    ? referral.settledAmount
                    : referral.isSettled
                    ? yieldAmount
                    : 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Grid */}
        <div className="flex lg:flex-col order-1 md:order-2 items-center lg:items-end justify-between lg:justify-center gap-6 shrink-0 md:border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
          {/* WhatsApp Button with Premium Visuals (matching Bell design without shimmer) */}
          <div className="relative h-12 w-12 group shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Nudge via WhatsApp"
              className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-700 shadow-[0_8px_20px_rgba(16,185,129,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-110 flex items-center justify-center text-white"
            >
              {/* Top glossy highlight */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-2 rounded-full bg-white/30 blur-sm pointer-events-none" />

              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="currentColor"
                className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>

          {/* Status Badge with custom colors and light opacity background */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm ${statusStyle.text}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${statusStyle.dot} animate-pulse`}
            />
            <span className="text-xs font-black uppercase tracking-wider">
              {referral.leadStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Rejection Reason Section */}
      {referral.leadStatus === "Rejected" && referral.rejectionReason && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-100"
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-rose-500"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-rose-600 mb-0.5">
                Reason for Rejection
              </p>
              <p className="text-xs text-rose-800 leading-relaxed font-semibold capitalize">
                {referral.rejectionReason}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
