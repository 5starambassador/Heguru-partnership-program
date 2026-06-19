"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Share2,
  UserPlus,
  ChevronRight,
  Clock,
  Star,
  TrendingUp,
  Wallet,
  Copy,
  Check,
  CheckCircle,
  Award,
  ChevronDown,
  User,
  Clipboard,
  Bell,
  Calendar,
  Megaphone,
  ChartBar,
  ChartNoAxesCombined,
} from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useState, useEffect, useRef, ReactNode } from "react";

import { PageAnimate, PageItem } from "@/components/PageAnimate";
import { CircularProgress } from "@/components/ui/CircularProgress";

interface ActionHomeBlueUnifiedProps {
  user: {
    fullName: string;
    role: string;
    confirmedReferralCount: number;
    yearFeeBenefitPercent: number;
    potentialFeeBenefitPercent?: number;
    benefitStatus: string;
    status: string;
    empId?: string | null;
    assignedCampus?: string | null;
    referralCode: string;
    studentFee?: number;
    isFiveStarMember?: boolean;
    lifetimeCount?: number;
  };
  recentReferrals: any[];
  whatsappUrl: string;
  referralLink: string;
  monthStats?: any | null;
  totalLeadsCount?: number;
  overrideEarnedAmount?: number;
  overrideGrossAmount?: number;
  overrideSettledAmount?: number;
  overrideEstimatedAmount?: number;
  notifications?: any[];
  unreadCount?: number;
  activeYears?: any[];
  selectedYearId?: string;
  onYearChange?: (yearId: string) => void;
}

// Local DashboardCard Component strictly adhering to the rounded-xl limit
const DashboardCard = ({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.005, translateY: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative bg-white border border-gray-300 p-2 rounded-xl text-slate-900 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${className}`}
    >
      {/* Subtle light accent */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/20 to-transparent opacity-40" />
      <div className="relative z-10 w-full">{children}</div>
    </motion.div>
  );
};

// Animation Variants
const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// Institutional Default Tiers (Fallback)
const tiers = [
  { count: 1, percent: 5 },
  { count: 2, percent: 10 },
  { count: 3, percent: 20 },
  { count: 4, percent: 30 },
  { count: 5, percent: 50 },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Happy Morning";
  if (hour < 17) return "Happy Afternoon";
  if (hour < 21) return "Happy Evening";
  return "Happy Night";
}

export function ActionHomeBlueUnified({
  user,
  recentReferrals,
  whatsappUrl,
  referralLink,
  monthStats,
  totalLeadsCount = 0,
  overrideEarnedAmount,
  overrideGrossAmount,
  overrideSettledAmount,
  overrideEstimatedAmount,
  notifications = [],
  unreadCount = 0,
  activeYears = [],
  selectedYearId = "all",
  onYearChange,
}: ActionHomeBlueUnifiedProps) {
  const firstName = user.fullName.split(" ")[0];

  // Dynamic Data
  const displayCount = user.confirmedReferralCount;

  const [greeting, setGreeting] = useState("");
  const [subtitle, setSubtitle] = useState<ReactNode>("");

  // Greeting Data Logic - Always target 5 Star
  const unitsToNext = 5 - (user.lifetimeCount || displayCount);

  useEffect(() => {
    const hour = new Date().getHours();
    let timeGreeting = "Happy Morning";
    if (hour >= 12 && hour < 17) timeGreeting = "Happy Afternoon";
    if (hour >= 17 && hour < 21) timeGreeting = "Happy Evening";
    if (hour >= 21) timeGreeting = "Happy Night";

    setGreeting(timeGreeting);

    // Set Contextual Subtitle
    if (user.isFiveStarMember) {
      setSubtitle(
        <span className="text-[var(--primary-orange)]">
          Maintained 5-Star Elite Status.
        </span>,
      );
    } else if (displayCount >= 5) {
      setSubtitle(
        <span className="text-[var(--primary-orange)]">
          You've reached the Executive Elite.
        </span>,
      );
    } else if (unitsToNext > 0) {
      setSubtitle(
        <>
          You’re only{" "}
          <span className="text-[var(--primary-orange)]">
            {unitsToNext} {unitsToNext === 1 ? "unit" : "units"}
          </span>{" "}
          away from achieving{" "}
          <span className="text-[var(--primary-orange)]">
            5-Star Member Status
          </span>
          .
        </>,
      );
    } else {
      setSubtitle("Your Royal Impact Overview"); // Default fallback
    }
  }, [displayCount, unitsToNext, user.isFiveStarMember]);

  const [longTermExpanded, setLongTermExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Year filter dropdown state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const benefitPercent = user.yearFeeBenefitPercent || 0;
  const potentialBenefitPercent = user.potentialFeeBenefitPercent || 0;
  const totalFee = user.studentFee || 0;

  // Labels based on role
  const isParent = user.role === "Parent";
  const benefitLabel = isParent ? "Fee Benefit" : "Earnings";

  // Calculate Amounts
  const currentBenefitAmount =
    overrideEarnedAmount !== undefined
      ? overrideEarnedAmount
      : (totalFee * benefitPercent) / 100;

  const potentialBenefitAmount =
    overrideEstimatedAmount !== undefined
      ? overrideEstimatedAmount
      : (totalFee * potentialBenefitPercent) / 100;

  return (
    <PageAnimate className="relative flex flex-col gap-6 pb-24 md:pb-12 pt-6 max-w-[1400px] mx-auto overflow-hidden">
      {/* Atmospheric light glows */}
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-[var(--primary-orange)]/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[15%] right-[-5%] w-[35%] h-[35%] bg-[var(--learning-blue)]/[0.02] rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 transition-all duration-500"
      >
        <div className="lg:col-span-8 space-y-6">
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Hero Section - Elite Greeting */}
            <DashboardCard className="flex-1 relative overflow-hidden !bg-gradient-to-br !from-orange-50/40 !via-white !to-blue-50/40 border-gray-300 p-6">
              <div className="relative z-10 flex flex-col justify-between h-full p-4">
                <div>
                  {/* <div className="mb-6">
                                        <div className="inline-flex items-center px-4 py-1.5 rounded-xl bg-[var(--primary-orange)]/10 border border-[var(--primary-orange)]/20 text-[10px] font-black text-[var(--primary-orange)] uppercase tracking-[0.25em] shadow-sm">
                                            25<sup className="text-[0.6em] ml-0.5">th</sup> <span className="ml-1.5">Year Celebration</span>
                                        </div>
                                    </div> */}
                  <h1 className="mb-4 tracking-[-0.03em] leading-tight flex flex-col gap-0 md:gap-2">
                    <span className="text-xl md:text-3xl font-medium text-[var(--deep-black)] tracking-lighter leading-none mb-1 font-heading">
                      {greeting},
                    </span>
                    <span className="text-3xl md:text-6xl font-black text-[var(--deep-black)] font-heading">
                      {firstName}
                    </span>
                  </h1>
                  <p className="text-slate-700 font-bold uppercase tracking-[0.2em] text-[11px] mt-6 leading-relaxed">
                    {subtitle}
                  </p>
                </div>

                <div className="mt-8 flex flex-col md:flex-row items-start gap-6 md:gap-10 opacity-100">
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold mb-2">
                      Account Status
                    </p>
                    {(() => {
                      const s = user.status;
                      if (s === "Active") {
                        return (
                          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-black uppercase tracking-widest shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </div>
                        );
                      }
                      if (s === "Pending") {
                        return (
                          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 text-[11px] font-black uppercase tracking-widest shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            Pending
                          </div>
                        );
                      }
                      return (
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-black uppercase tracking-widest shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                          {s}
                        </div>
                      );
                    })()}
                  </div>
                  {user.benefitStatus === "Inactive" && (
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-rose-500 font-bold mb-2">
                        Verification
                      </p>
                      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-black uppercase tracking-widest shadow-sm animate-pulse">
                        Needs Update
                      </div>
                    </div>
                  )}
                  <div className="hidden md:block w-px h-12 bg-gray-200" />
                  <div className="text-left w-full md:w-auto overflow-hidden">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold mb-2">
                      Campus
                    </p>
                    <p className="text-[var(--deep-black)] font-black text-xl md:text-2xl tracking-tighter uppercase leading-none break-words">
                      {user.assignedCampus || "Corporate"}
                    </p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-gray-200" />
                  <div className="text-left relative z-20">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold mb-3 pl-1">
                      Partner ID
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(user.referralCode);
                        toast.success("Partner ID copied to clipboard");
                      }}
                      className="group/id relative flex items-center gap-4  bg-[var(--soft-gray)] rounded-xl underline underline-offset-8 decoration-primary-orange hover:border-gray-300 transition-all duration-300 shadow-sm overflow-hidden"
                    >
                      <p className="text-[var(--deep-black)] font-black text-xl md:text-2xl tracking-[0.15em] uppercase leading-none font-mono relative z-10">
                        {user.referralCode}
                      </p>

                      <div className="p-2 rounded-xl bg-white border border-[var(--warm-gray)] group-hover/id:border-gray-300 transition-all relative z-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--text-gray)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            minWidth: "16px",
                            minHeight: "16px",
                            display: "block",
                          }}
                        >
                          <rect
                            width="14"
                            height="14"
                            x="8"
                            y="8"
                            rx="1"
                            ry="1"
                          />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </DashboardCard>

            <div className="flex flex-col md:flex-row gap-6 w-full relative z-10 transition-all duration-700">
              {/* Referral Status Card */}
              <DashboardCard className="w-full md:w-64 !bg-white border-gray-300 shadow-sm group/gold transition-all">
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center py-6">
                  <h3 className="text-lg font-bold text-[var(--deep-black)] tracking-lighter leading-none font-heading mb-10">
                    Referral Status
                  </h3>
                  <div className="relative">
                    <CircularProgress
                      value={displayCount}
                      max={5}
                      size={140}
                      strokeWidth={8}
                      className="text-[var(--primary-orange)]"
                    >
                      <div className="text-center w-full">
                        <div className="text-5xl font-black text-[var(--deep-black)] tracking-[-0.05em] leading-none mb-1 font-heading">
                          {displayCount}
                        </div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                          Units
                        </div>
                      </div>
                    </CircularProgress>
                  </div>
                  <div className="mt-6">
                    {user.isFiveStarMember || (user.lifetimeCount || 0) >= 5 ? (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-2"
                      >
                        <div className="text-[var(--primary-orange)] font-medium text-[10px] uppercase tracking-widest">
                          {user.isFiveStarMember
                            ? "Status Maintained"
                            : "Peak Achievement"}
                        </div>
                        <div className="bg-[var(--primary-orange)] text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] shadow-sm inline-flex items-center gap-2">
                          <Star size={12} fill="white" />
                          5-Star Elite
                          <Star size={12} fill="white" />
                        </div>
                      </motion.div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--soft-gray)] border border-[var(--warm-gray)] text-[14px] font-medium text-[var(--text-gray)] uppercase tracking-widest">
                        Next Goal:{" "}
                        <span className="text-[var(--primary-orange)] font-bold">
                          5-Star
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </DashboardCard>

              {/* Net Rewards Card */}
              <DashboardCard className="flex-1 relative !bg-white border-gray-300 shadow-sm flex flex-col p-0">
                {/* Floating icon badge — matches Performance card style */}
                <div className="absolute top-5 right-5 z-20">
                  <div className="relative h-12 w-12 group/badge">
                    <div className="absolute inset-0 rounded-full bg-white border border-primary-orange shadow-xl">
                     
                      <div className="relative z-10 flex h-full w-full items-center justify-center">
                        <Wallet size={20} className="text-[var(--primary-orange)] drop-shadow-[0_1px_4px_rgba(242,110,33,0.4)]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Header — orange left-bar + title + subtitle */}
                <div className="p-6 mt-6">
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-1 h-8 bg-gradient-to-b from-[var(--primary-orange)] to-[var(--primary-orange-hover)] rounded-sm" />
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-[var(--deep-black)] tracking-tighter uppercase leading-none font-heading">
                        Net Rewards
                      </h2>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">
                        {benefitLabel}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">
                      Secured Balance
                    </div>
                    <div className="flex items-baseline gap-4">
                      <div className="text-4xl md:text-7xl font-black tracking-[-0.05em] text-[var(--deep-black)] leading-none tabular-nums font-heading">
                        ₹{currentBenefitAmount.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[12px] font-black text-[var(--primary-orange)] bg-[var(--primary-orange)]/10 px-3 py-1 rounded-xl border border-[var(--primary-orange)]/20 mb-2 shadow-sm">
                        {benefitPercent}%
                      </div>
                    </div>
                    {overrideSettledAmount && overrideSettledAmount > 0 ? (
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                          <CheckCircle size={10} />
                          Paid: ₹{overrideSettledAmount.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] font-black text-[var(--text-gray)] uppercase tracking-widest">
                          Total: ₹
                          {(
                            overrideGrossAmount || currentBenefitAmount
                          ).toLocaleString("en-IN")}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="relative z-20 p-6 md:px-10 mt-auto border-t border-gray-150 bg-slate-50/50 rounded-b-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">
                        Projected Potential
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-black text-[var(--deep-black)] tracking-tighter tabular-nums font-heading">
                          ₹{potentialBenefitAmount.toLocaleString("en-IN")}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white border border-gray-200 text-[10px] font-black text-[var(--learning-blue)] uppercase tracking-widest shadow-sm">
                          <TrendingUp size={12} className="text-emerald-500" />
                          {potentialBenefitPercent}% Efficiency
                        </div>
                      </div>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-orange)] shadow-[0_0_12px_rgba(242,110,33,0.5)] animate-pulse" />
                  </div>
                </div>
              </DashboardCard>
            </div>

            {/* <div className="flex items-center gap-3 mt-6">
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="flex-1 group relative flex items-center justify-center gap-4 bg-[var(--primary-orange)]/10 text-[var(--primary-orange)] h-12 md:h-16 rounded-xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.25em] shadow-sm border border-[var(--primary-orange)]/30 hover:bg-[var(--primary-orange)]/25 hover:border-[var(--primary-orange)]/55 transition-all overflow-hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="relative z-10"
                  style={{
                    minWidth: "18px",
                    minHeight: "18px",
                    display: "block",
                  }}
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                  <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                </svg>
                <span className="relative z-10">Invite Friends</span>
              </motion.a>

              <button
                onClick={handleCopy}
                className="h-12 w-12 md:h-16 md:w-16 bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white border border-[var(--primary-orange-hover)] rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-sm relative group"
              >
                {copied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      minWidth: "20px",
                      minHeight: "20px",
                      display: "block",
                    }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      minWidth: "22px",
                      minHeight: "22px",
                      display: "block",
                    }}
                  >
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  </svg>
                )}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 shadow-lg">
                  Copy Link
                </span>
              </button>
            </div> */}
          </motion.div>

          {/* PRIMARY CTA - Prominent Refer Button */}
          {/* <motion.div variants={itemVariants}>
            <PageItem className="relative z-10 mt-6">
              <Link href="/refer">
                <motion.div
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="group bg-gradient-to-r from-[var(--learning-blue)]/5 to-[var(--learning-blue)]/[0.02] border border-[var(--learning-blue)]/20 rounded-xl p-5 md:p-8 flex items-center justify-between shadow-sm hover:bg-[var(--learning-blue)]/[0.08] transition-all relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[var(--learning-blue)] rounded-xl flex items-center justify-center border border-white/20 shadow-sm text-white">
                      <UserPlus size={24} className="md:hidden" />
                      <UserPlus size={32} className="hidden md:block" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl md:text-4xl font-black tracking-tighter leading-tight mb-1 text-[var(--deep-black)] uppercase italic font-heading">
                        Refer a Family Now
                      </h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        Start earning royal benefits today
                      </p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[var(--warm-gray)] flex items-center justify-center group-hover:bg-[var(--learning-blue)] group-hover:border-[var(--learning-blue)] transition-all">
                    <ChevronRight
                      size={24}
                      className="text-slate-400 group-hover:text-white transition-colors"
                    />
                  </div>
                </motion.div>
              </Link>
            </PageItem>
          </motion.div> */}

          {/* BENEFIT STRUCTURE */}
          <motion.div variants={itemVariants}>
            <PageItem className="bg-white rounded-xl p-6 md:p-8 border border-gray-300 shadow-sm relative z-10 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-[var(--primary-orange)] to-[var(--primary-orange-hover)] rounded-sm" />
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-[var(--deep-black)] tracking-tighter uppercase italic font-heading">
                    Benefits
                  </h2>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                    Tiered Rewards Structure
                  </p>
                </div>
              </div>

              {/* Short Term Tiers */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle
                    size={14}
                    className="text-[var(--primary-orange)]"
                  />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Current Year (Short Term)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 md:grid-cols-5 md:gap-3">
                  {tiers.map((tier, index) => {
                    const isCurrentTier = displayCount === tier.count;
                    const isAchieved = displayCount >= tier.count;

                    const getCardClasses = () => {
                      const isFuture = tier.count > displayCount;
                      const isNext =
                        tier.count > displayCount &&
                        (index === 0 ||
                          displayCount >= tiers[index - 1]?.count);

                      let baseStyle =
                        "border rounded-xl backdrop-blur-sm transition-all";
                      if (index === 4) {
                        // 5 Star Tier Custom Style
                        return `${baseStyle} bg-gradient-to-br from-amber-500/10 to-amber-600/15 border-amber-500/20 text-amber-800 font-black shadow-inner`;
                      }

                      if (isCurrentTier)
                        return `${baseStyle} bg-[var(--primary-orange)]/10 border-[var(--primary-orange)] text-[var(--primary-orange)] ring-1 ring-[var(--primary-orange)] shadow-sm scale-102`;
                      if (isAchieved)
                        return `${baseStyle} bg-[var(--soft-gray)] border-[var(--warm-gray)] text-[var(--deep-black)]`;
                      if (isNext)
                        return `${baseStyle} bg-[var(--soft-gray)]/60 border-gray-200 text-slate-500 opacity-80`;
                      return `${baseStyle} bg-gray-50/40 border-gray-150 text-slate-400 opacity-60`;
                    };

                    return (
                      <div
                        key={tier.count}
                        className={`py-3 md:py-6 px-1 md:px-2 text-center ${getCardClasses()}`}
                      >
                        <div
                          className={`text-[9px] font-black uppercase tracking-[0.15em] mb-1.5 ${
                            index === 4 ? "text-amber-800/70" : "text-slate-500"
                          }`}
                        >
                          {tier.count} {tier.count > 1 ? "Units" : "Unit"}
                        </div>
                        <div
                          className={`text-xl md:text-3xl font-black tracking-tighter tabular-nums leading-none ${
                            index === 4
                              ? "text-amber-900"
                              : "text-[var(--deep-black)]"
                          }`}
                        >
                          <span className="inline-block font-heading">
                            {tier.percent}
                          </span>
                          <span className="text-sm md:text-xl ml-0.5 opacity-60">
                            %
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Long Term Benefits */}
              <div className="bg-[var(--soft-gray)] rounded-xl overflow-hidden border border-[var(--warm-gray)]">
                <button
                  onClick={() => setLongTermExpanded(!longTermExpanded)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-150 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[var(--primary-orange)]/10 rounded-xl flex items-center justify-center border border-[var(--primary-orange)]/20 group-hover:scale-105 transition-transform">
                      <Star
                        size={20}
                        className="text-[var(--primary-orange)] fill-[var(--primary-orange)]"
                      />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-black text-[var(--deep-black)] uppercase tracking-tight font-heading">
                        Long Term Loyalty
                      </h3>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                        Recurring annual reduction
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 transition-transform duration-500 ${
                      longTermExpanded
                        ? "rotate-180 text-[var(--primary-orange)]"
                        : ""
                    }`}
                  />
                </button>

                {longTermExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6"
                  >
                    <div className="flex items-center justify-center gap-3 mb-6 bg-white py-4 rounded-xl border border-[var(--warm-gray)]">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={28}
                          className={`${
                            i <= displayCount
                              ? "text-[var(--primary-orange)] fill-[var(--primary-orange)]"
                              : "text-gray-200"
                          } transition-all duration-700`}
                          strokeWidth={i <= displayCount ? 0 : 2}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-blue-800 transition-all">
                        <p className="text-[9px] font-black text-blue-700/80 uppercase tracking-[0.2em] mb-3">
                          Base Loyalty
                        </p>
                        <div className="flex items-end gap-1.5">
                          <p className="text-4xl font-black tracking-tighter tabular-nums leading-none font-heading">
                            15%
                          </p>
                          <span className="text-[10px] text-blue-700/50 font-black uppercase mb-1">
                            Annual
                          </span>
                        </div>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-800 transition-all">
                        <p className="text-[9px] font-black text-emerald-700/80 uppercase tracking-[0.2em] mb-3">
                          Bonus Boost
                        </p>
                        <div className="flex items-end gap-1.5">
                          <p className="text-4xl font-black tracking-tighter tabular-nums leading-none font-heading">
                            +5%
                          </p>
                          <span className="text-[10px] text-emerald-700/50 font-black uppercase mb-1 whitespace-nowrap">
                            Per Ref
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-white border border-[var(--warm-gray)]">
                      <p className="text-[9px] text-[var(--text-gray)] font-black uppercase tracking-widest leading-relaxed text-center w-full">
                        * Unlock requirement: Single verified unit in current
                        cycle
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </PageItem>
          </motion.div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            {/* Year Filter */}
            {activeYears.length > 0 && (
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Filter by
                  </span>
                  <div className="relative" ref={filterRef}>
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--warm-gray)] rounded-full text-sm font-medium hover:bg-[var(--soft-gray)] text-[var(--deep-black)] transition-colors shadow-sm"
                    >
                      <Calendar className="w-4 h-4 text-[var(--primary-orange)]" />
                      <span>
                        {activeYears.find((y: any) => y.id === selectedYearId)
                          ?.year || "All Time"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isFilterOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isFilterOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-48 bg-white border border-[var(--warm-gray)] rounded-xl shadow-lg z-50 overflow-hidden"
                        >
                          {activeYears.map((year: any) => (
                            <button
                              key={year.id}
                              onClick={() => {
                                onYearChange?.(year.id);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 text-sm hover:bg-[var(--soft-gray)] transition-colors ${
                                selectedYearId === year.id
                                  ? "text-[var(--primary-orange)] font-medium bg-[var(--primary-orange)]/[0.04]"
                                  : "text-[var(--text-gray)]"
                              }`}
                            >
                              {year.year}
                              {year.isCurrent && (
                                <span className="ml-2 text-xs bg-[var(--primary-orange)]/10 text-[var(--primary-orange)] px-2 py-0.5 rounded-md">
                                  Current
                                </span>
                              )}
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              onYearChange?.("all");
                              setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm hover:bg-[var(--soft-gray)] transition-colors border-t border-[var(--warm-gray)] ${
                              selectedYearId === "all"
                                ? "text-[var(--primary-orange)] font-medium bg-[var(--primary-orange)]/[0.04]"
                                : "text-[var(--text-gray)]"
                            }`}
                          >
                            All Time
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
            {/* NOTIFICATION CENTER */}
            <PageItem className="relative z-10 group/notify ">
              <DashboardCard
                className={`relative !bg-white border-gray-300 shadow-sm overflow-hidden`}
              >
                <div className="absolute top-1 right-1 z-20">
                  <div className="w-10 h-10 rounded-full bg-white border border-primary-orange shadow-xl text-primary-orange flex items-center justify-center relative overflow-hidden transition-transform duration-500">
                    <div className="relative z-10">
                      <Megaphone />
                    </div>

                    {unreadCount && unreadCount > 0 ? (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-[var(--primary-orange)] rounded-full animate-pulse shadow-[0_0_8px_var(--primary-orange)]" />
                    ) : null}
                  </div>
                </div>
                <button
                  onClick={() => setLongTermExpanded(!longTermExpanded)}
                  className="w-full text-left relative z-10 outline-none"
                >
                  <div className="flex items-center justify-between p-6 mt-5">
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div className="w-1 h-8 bg-gradient-to-b from-[var(--primary-orange)] to-[var(--primary-orange-hover)] rounded-sm" />
                      <div className="flex gap-2 items-center">
                        <div>
                          <h3 className="text-xl md:text-2xl font-black text-[var(--deep-black)] tracking-tighter uppercase leading-none font-heading">
                            Circulars & Messages
                          </h3>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            Stay Updated
                            {unreadCount && unreadCount > 0 && (
                              <span className="bg-[var(--primary-orange)]/20 px-1.5 py-0.5 rounded text-[var(--primary-orange)] animate-pulse">
                                {unreadCount} New
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-xl bg-[var(--soft-gray)] flex items-center justify-center border border-[var(--warm-gray)] transition-all duration-500 ${
                        longTermExpanded
                          ? "rotate-180 text-[var(--primary-orange)] border-[var(--primary-orange)]/25"
                          : ""
                      }`}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </div>

                  {!longTermExpanded && (
                    <div className="px-6 pb-6 pt-0">
                      <div className="p-3 rounded-xl bg-[var(--soft-gray)] border border-[var(--warm-gray)] flex items-center gap-3">
                        <div className="w-1 h-8 bg-[var(--primary-orange)]/50 rounded-full flex-shrink-0" />
                        <p className="text-xs text-slate-700 font-medium line-clamp-1">
                          {notifications && notifications.length > 0
                            ? notifications[0].title
                            : "Tap to view all latest updates, circulars, and announcements."}
                        </p>
                      </div>
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {longTermExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                      }}
                      className="overflow-hidden bg-[var(--soft-gray)]/30 border-t border-gray-200"
                    >
                      <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {!notifications || notifications.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center mx-auto mb-3">
                              <Bell size={20} className="text-slate-400" />
                            </div>
                            <p className="text-[var(--deep-black)] font-bold mb-1 uppercase tracking-tight">
                              No New Circulars
                            </p>
                            <p className="text-xs text-slate-400">
                              You're all caught up!
                            </p>
                          </div>
                        ) : (
                          notifications.map((notif: any) => (
                            <div
                              key={notif.id}
                              className={`p-4 rounded-xl border transition-colors group/item relative bg-white ${
                                notif.isRead
                                  ? "border-gray-200"
                                  : "bg-[var(--primary-orange)]/[0.04] border-[var(--primary-orange)]/20"
                              }`}
                            >
                              {!notif.isRead && (
                                <div className="absolute top-4 right-4 w-2 h-2 bg-[var(--primary-orange)] rounded-full shadow-[0_0_8px_var(--primary-orange)]" />
                              )}
                              <div className="flex justify-between items-start mb-2 pr-4">
                                <span
                                  className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                                    notif.type === "success"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : notif.type === "warning"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-blue-50 text-blue-700 border-blue-200"
                                  }`}
                                >
                                  {notif.type || "Info"}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  <Clock size={10} className="inline mr-1" />
                                  {mounted
                                    ? new Date(
                                        notif.createdAt,
                                      ).toLocaleDateString()
                                    : ""}
                                </span>
                              </div>
                              <h4 className="text-[var(--deep-black)] font-bold text-sm mb-1 group-hover/item:text-[var(--primary-orange)] transition-colors pr-4">
                                {notif.title}
                              </h4>
                              <p className="text-xs text-[var(--text-gray)] leading-relaxed">
                                {notif.message}
                              </p>
                              <div className="flex items-center justify-between mt-3">
                                {notif.link ? (
                                  <Link
                                    href={notif.link}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--primary-orange)] hover:text-[var(--primary-orange-hover)] uppercase tracking-wider"
                                  >
                                    View Details <ChevronRight size={12} />
                                  </Link>
                                ) : (
                                  <div />
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const shareData = {
                                      title: notif.title,
                                      text: `${notif.title}\n\n${notif.message}`,
                                      url: notif.link || window.location.href,
                                    };

                                    if (navigator.share) {
                                      navigator
                                        .share(shareData)
                                        .catch(console.error);
                                    } else {
                                      navigator.clipboard.writeText(
                                        `${shareData.title}\n${shareData.text}\n${shareData.url}`,
                                      );
                                      toast.success(
                                        "Message copied to clipboard",
                                      );
                                    }
                                  }}
                                  className="p-1.5 rounded-xl bg-[var(--soft-gray)] hover:bg-[var(--warm-gray)] text-[var(--text-gray)] transition-colors"
                                  title="Share Message"
                                >
                                  <Share2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}

                        {notifications && notifications.length > 0 && (
                          <div className="text-center py-4">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                              End of Updates
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </DashboardCard>
            </PageItem>

            {/* PERFORMANCE OVERVIEW */}
            {monthStats && (
              <PageItem className="relative z-10 overflow-hidden">
                <DashboardCard className=" relative !bg-white border-gray-300 shadow-sm">
                  <div className="absolute top-5 right-5 z-20">
                    <div className="relative h-12 w-12 group/badge">
                      <div className="absolute inset-0 rounded-full bg-white border border-primary-orange shadow-xl">
                        <div className="relative z-10 flex h-full w-full items-center justify-center">
                          <ChartNoAxesCombined size={20} className="text-[var(--primary-orange)] drop-shadow-[0_1px_4px_rgba(242,110,33,0.4)]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 mt-1">
                    <div className="flex items-center gap-3 mb-6 relative z-10 ">
                      <div className="w-1 h-8 bg-gradient-to-b from-[var(--primary-orange)] to-[var(--primary-orange-hover)] rounded-sm" />
                      <div>
                        <h2 className="text-xl md:text-2xl font-black text-[var(--deep-black)] tracking-tighter uppercase leading-none font-heading">
                          Performance
                        </h2>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">
                          Yield Tracking
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                      <div className="p-4 rounded-xl bg-yellow-100 border border-[var(--warm-gray)] group/stat1 relative overflow-hidden">
                        <svg
                          className="absolute top-1/2 right-2 w-16 h-8 -translate-y-1/2 opacity-60 group-hover/stat1:opacity-25 transition-opacity"
                          viewBox="0 0 100 50"
                        >
                          <path
                            d="M0 40 Q 25 35, 50 20 T 100 10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-primary-orange"
                          />
                        </svg>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 block mb-2 relative z-10">
                          Pending
                        </span>
                        <div className="flex items-end gap-1.5 font-black text-[var(--deep-black)]">
                          <span className="text-4xl tracking-tighter tabular-nums leading-none font-heading">
                            {totalLeadsCount || 0}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase mb-1.5 opacity-60">
                            Leads
                          </span>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-green-200 border border-[var(--warm-gray)] group/stat2 relative overflow-hidden">
                        <svg
                          className="absolute top-1/2 right-2 w-16 h-8 -translate-y-1/2 opacity-60 group-hover/stat2:opacity-25 transition-opacity"
                          viewBox="0 0 100 50"
                        >
                          <path
                            d="M0 40 L 20 35 L 40 38 L 60 20 L 80 25 L 100 5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-green-800"
                          />
                        </svg>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 block mb-2 relative z-10">
                          Confirmed
                        </span>
                        <div className="flex items-end gap-1.5 font-black text-[var(--deep-black)]">
                          <span className="text-4xl tracking-tighter tabular-nums leading-none font-heading">
                            {displayCount}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase mb-1.5 opacity-60">
                            Units
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              </PageItem>
            )}

            {/* RECENT REFERRALS */}
            <PageItem className="relative z-10">
              <div className="absolute top-5 right-5 z-20">
                <div className="relative h-12 w-12 group/badge">
                  <div className="absolute inset-0 rounded-full bg-white border border-primary-orange shadow-xl">
                   
                    <div className="relative z-10 flex h-full w-full items-center justify-center">
                      <Megaphone size={20} className="text-[var(--primary-orange)] drop-shadow-[0_1px_4px_rgba(242,110,33,0.4)]" />
                    </div>
                  </div>
                </div>
              </div>
              <DashboardCard className="h-full p-0 border border-gray-300 rounded-xl bg-white shadow-sm">
                <div className="p-3 mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 border-b border-gray-200 relative z-10 bg-slate-50/50 rounded-t-md gap-3 sm:gap-0">
                    <div className="flex items-center gap-3 mb-3 relative z-10 ">
                      <div className="w-1 h-8 bg-gradient-to-b from-[var(--primary-orange)] to-[var(--primary-orange-hover)] rounded-sm" />
                      <div>
                        <h2 className="text-xl md:text-2xl font-black text-[var(--deep-black)] tracking-tighter uppercase leading-none font-heading">
                          Activity
                        </h2>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">
                          Yield Tracking
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/referrals"
                      className="text-[10px] font-bold text-[var(--primary-orange)] uppercase tracking-[0.2em] flex items-center gap-1 hover:bg-[var(--primary-orange)]/5 px-3 py-1.5 rounded-xl transition-all border border-transparent hover:border-[var(--primary-orange)]/15"
                    >
                      View Referrals <ChevronRight size={14} />
                    </Link>
                  </div>

                  {recentReferrals.length === 0 ? (
                    <div className="p-12 text-center relative z-10">
                      <div className="w-16 h-16 bg-[var(--soft-gray)] rounded-xl flex items-center justify-center mx-auto mb-4 border border-[var(--warm-gray)] text-slate-400 shadow-sm">
                        <UserPlus size={24} />
                      </div>
                      <p className="text-[var(--deep-black)] font-bold mb-1 uppercase tracking-tight">
                        No Activity
                      </p>
                      <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest mb-6">
                        Start sharing to earn
                      </p>
                      <Link
                        href="/refer"
                        className="inline-flex items-center gap-2 bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm"
                      >
                        Make First Referral
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 relative z-10">
                      {recentReferrals.map((referral) => (
                        <div
                          key={referral.leadId}
                          className="p-5 hover:bg-[var(--soft-gray)] transition-colors group/item"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[var(--soft-gray)] border border-[var(--warm-gray)] rounded-xl flex items-center justify-center text-[var(--deep-black)] font-black shadow-inner uppercase">
                              {(
                                referral.studentName || referral.parentName
                              ).charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-xs text-slate-800 truncate group-hover/item:text-[var(--deep-black)] transition-colors uppercase tracking-tight">
                                {referral.studentName || referral.parentName}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <span
                                  className={`px-2 py-0.5 rounded-xl text-[8px] font-bold uppercase tracking-widest border ${
                                    referral.status === "Confirmed"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-amber-50 text-amber-700 border-amber-200"
                                  }`}
                                >
                                  {referral.status}
                                </span>
                                <span className="text-[9px] text-slate-500 flex items-center gap-1 font-medium uppercase">
                                  <Clock size={8} />{" "}
                                  {new Date(
                                    referral.createdAt,
                                  ).toLocaleDateString("en-GB")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DashboardCard>
            </PageItem>
          </motion.div>

          {/* PRIMARY CTA — Refer a Family */}
          <motion.div variants={itemVariants}>
            <Link href="/refer">
              <motion.div
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="group bg-white border border-gray-300 rounded-xl p-5 md:p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-[var(--learning-blue)]/30 transition-all relative overflow-hidden cursor-pointer"
              >
                {/* subtle gradient wash */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--learning-blue)]/[0.03] to-transparent pointer-events-none" />
                <div className="flex items-center gap-5 relative z-10">
                  {/* 3D blue icon — same structure as bell, no shimmer, blue palette */}
                  <div className="relative shrink-0 h-12 w-12 md:h-14 md:w-14 group/refer">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-300 via-[var(--learning-blue)] to-blue-800 shadow-[0_8px_20px_rgba(37,99,235,0.35),inset_0_2px_3px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover/refer:scale-105">
                      {/* gloss pill */}
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-7 h-2.5 rounded-full bg-white/35 blur-sm" />
                      {/* icon */}
                      <div className="relative z-10 flex h-full w-full items-center justify-center">
                        <UserPlus size={22} className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg md:text-2xl font-black tracking-tighter leading-tight mb-0.5 text-[var(--deep-black)] uppercase font-heading">
                      Refer a Family Now
                    </h3>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      Start earning royal benefits today
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[var(--soft-gray)] border border-[var(--warm-gray)] flex items-center justify-center group-hover:bg-[var(--learning-blue)] group-hover:border-[var(--learning-blue)] transition-all shrink-0 relative z-10">
                  <ChevronRight
                    size={20}
                    className="text-slate-400 group-hover:text-white transition-colors"
                  />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* INVITE FRIENDS + COPY LINK */}
          <motion.div variants={itemVariants}>
            <DashboardCard className="!p-0 border-gray-300 shadow-sm overflow-hidden">
              <div className="p-5 md:p-6">
                {/* <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-[var(--primary-orange)] to-[var(--primary-orange-hover)] rounded-sm" />
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-[var(--deep-black)] tracking-tighter uppercase leading-none font-heading">
                        Spread the Word
                      </h2>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">
                        Share your referral link
                      </p>
                    </div>
                  </div> */}

                <div className="flex items-center gap-3">
                  {/* Invite Friends — Share icon gets the 3D bell treatment */}
                  <motion.a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    className="flex-1 group relative flex items-center justify-center gap-3 bg-[var(--primary-orange)]/8 text-[var(--primary-orange)] h-12 md:h-14 rounded-xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] border border-[var(--primary-orange)]/25 hover:bg-[var(--primary-orange)]/15 hover:border-[var(--primary-orange)]/50 transition-all shadow-sm"
                  >
                    {/* 3D sphere icon — same as bell */}
                    <div className="relative shrink-0 h-8 w-8 group/icon">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300 via-[var(--primary-orange)] to-orange-700 shadow-[0_6px_16px_rgba(249,115,22,0.4),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_5px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover/icon:scale-110">
                        {/* gloss highlight */}
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-2 rounded-full bg-white/40 blur-sm" />
                        {/* shimmer sweep */}
                        {/* <div className="absolute inset-0 overflow-hidden rounded-full">
                          <div className="absolute -left-8 top-0 h-full w-5 rotate-12 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_3s_linear_infinite]" />
                        </div> */}
                        <div className="relative z-10 flex h-full w-full items-center justify-center">
                          <Share2 size={14} className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />
                        </div>
                      </div>
                    </div>
                    <span className="relative z-10">Invite Friends</span>
                  </motion.a>

                  {/* Copy button — 3D sphere treatment matching bell icon */}
                  <button
                    onClick={handleCopy}
                    className="relative shrink-0 h-12 w-12 md:h-14 md:w-14 group/copy"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-300 via-[var(--primary-orange)] to-orange-700 shadow-[0_8px_20px_rgba(249,115,22,0.4),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-3px_6px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover/copy:scale-105 active:scale-95">
                      {/* gloss pill */}
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-7 h-2.5 rounded-full bg-white/35 blur-sm" />
                      {/* shimmer sweep */}
                      {/* <div className="absolute inset-0 overflow-hidden rounded-xl">
                        <div className="absolute -left-10 top-0 h-full w-6 rotate-12 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_3s_linear_infinite]" />
                      </div> */}
                      {/* icon */}
                      <div className="relative z-10 flex h-full w-full items-center justify-center">
                        {copied ? (
                          <Check size={18} className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />
                        ) : (
                          <Copy size={16} className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />
                        )}
                      </div>
                    </div>
                    {/* tooltip */}
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[var(--deep-black)] text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover/copy:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-20">
                      Copy Link
                    </span>
                  </button>
                </div>
              </div>
            </DashboardCard>
          </motion.div>
        </div>
      </motion.div>
    </PageAnimate>
  );
}
