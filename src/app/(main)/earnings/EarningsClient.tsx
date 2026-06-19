'use client'

import { useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Wallet, History, CheckCircle2, Clock, Calendar,
    IndianRupee, PieChart, Info, ChevronLeft, Coins, Zap, Building,
    TrendingUp, ArrowUpRight, Landmark, Filter, ChevronDown, Settings,
    ArrowLeft
} from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { PageAnimate, PageItem } from '../../../components/PageAnimate'
import { useClickOutside } from '@/hooks/use-click-outside'
import Link from 'next/link'
import { AccessibleProgressBar } from '@/components/ui/AccessibleProgressBar'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Settlement {
    id: number | string
    amount: number
    status: 'Processed' | 'Pending' | string
    createdAt: string | Date
    payoutDate?: string | Date | null
    bankReference?: string | null
    remarks?: string | null
}

interface EarningsStats {
    totalEarned: number
    referralYield: number
    bonusCredits: number
    refundAmount: number       // Registration fee refund — NOT part of earnings
    totalSettled: number
    pendingSettlement: number
    remainingBalance: number
    settlements: Settlement[]
    breakdown: string[]        // format: "LABEL = ₹AMOUNT" or "LABEL = Applied"
    referralCount: number
}

interface EarningsClientProps {
    stats: EarningsStats
    user: {
        role: string
        childInHeguru?: boolean
        name?: string
        accountNumber?: string | null
        ifscCode?: string | null
        paymentAmount?: number
    }
    activeYears: any[]
    selectedYear: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Safely parses a breakdown string like "WAIVER GROUP A = ₹12,000"
 * into a label/amount pair.
 */
function parseBreakdownItem(item: string): { label: string; amount: string } {
    const eqIdx = item.indexOf('=')
    if (eqIdx === -1) return { label: item.trim(), amount: '—' }
    return {
        label: item.slice(0, eqIdx).trim(),
        amount: item.slice(eqIdx + 1).trim() || '—',
    }
}

function getBreakdownIcon(label: string) {
    const up = label.toUpperCase()
    if (up.includes('WAIVER') || up.includes('GROUP A')) return <Building size={16} className="text-blue-400" />
    if (up.includes('PROFIT') || up.includes('SHARE') || up.includes('BONUS')) return <Coins size={16} className="text-amber-400" />
    if (up.includes('CREDIT') || up.includes('REFUND')) return <Landmark size={16} className="text-purple-400" />
    return <Zap size={16} className="text-emerald-400" />
}

function formatDate(d: string | Date) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EarningsClient({ stats, user, activeYears, selectedYear }: EarningsClientProps) {
    const isWaiverUser = user.role === 'Parent' || (user.role === 'Staff' && user.childInHeguru)

    // year Filter Logic
    const sortedYears = [...activeYears].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    const dropdownYears = [...sortedYears.map(y => y.year), 'All Time']

    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const filterRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const pathname = usePathname()

    useClickOutside(filterRef, () => setIsFilterOpen(false))

    const handleYearChange = (year: string) => {
        const params = new URLSearchParams(window.location.search)
        if (year === 'All Time') {
            params.set('year', 'All Time')
        } else {
            params.set('year', year)
        }
        router.push(`${pathname}?${params.toString()}`)
        setIsFilterOpen(false)
    }

    // Proactive Reminder Logic
    const hasMissingBankDetails = !user.accountNumber || !user.ifscCode
    const showBankReminder = hasMissingBankDetails && (stats.referralCount > 0 || (user.paymentAmount || 0) > 0)

    return (
        <div className="relative font-[family-name:var(--font-sans)] pb-28">

            <PageAnimate className="relative z-10 max-w-4xl mx-auto flex flex-col px-5 pb-8">

                {/* Bank Detail Reminder Banner */}
                {showBankReminder && (
                    <PageItem className="mt-8">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{backgroundColor:"rgba(255, 217, 0, 0.14)"}}
                            className="relative overflow-hidden rounded-full border border-[var(--primary-orange)]/20 p-6 shadow-sm"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.04]">
                                <IndianRupee size={80} className="text-[var(--primary-orange)]" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[var(--primary-orange)]/25 rounded-full border border-yellow-600 text-yellow-600">
                                        <Settings size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[var(--deep-black)] uppercase tracking-tight">Profile Readiness Required</h3>
                                        <p className="text-sm font-medium text-[var(--text-gray)] mt-2">
                                            You have active referrals but your bank details are missing. Fix this to enable your **payouts and registration fee refunds**.
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/profile"
                                    className="bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white px-6 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all text-center shadow-sm"
                                >
                                    Complete Profile
                                </Link>
                            </div>
                        </motion.div>
                    </PageItem>
                )}

                {/* Back Button */}
                <PageItem>
                    <Link
                        href="/dashboard"
                        className="w-max px-4 mb-6 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center gap-1.5 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 shadow-sm group"
                    >
                        <ArrowLeft
                            size={18}
                            className="text-gray-600 group-hover:text-gray-700 transition-colors"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                            Back
                        </span>
                    </Link>
                </PageItem>

                {/* ── Header ─────────────────────────────────────────── */}
                <PageItem>
                    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 mt-2 pt-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-4xl font-black text-[var(--deep-black)] tracking-tight uppercase italic leading-none mb-1 font-heading">
                                    My Earnings
                                </h1>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.25em]">
                                    Financial Portfolio
                                </p>
                            </div>
                        </div>

                        {/* Year Filter Dropdown */}
                        <div className="flex items-center gap-3">
                            <div className="relative" ref={filterRef}>
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-full text-gray-800 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    <Filter size={12} className="text-[var(--primary-orange)]" />
                                    <span>Cycle: {selectedYear}</span>
                                    <ChevronDown size={12} className={`text-gray-500 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isFilterOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-[60]"
                                        >
                                            {dropdownYears.map((year: string) => (
                                                <button
                                                    key={year}
                                                    onClick={() => handleYearChange(year)}
                                                    className={`w-full text-left px-4 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${selectedYear === year ? 'text-[var(--primary-orange)] font-bold bg-[var(--primary-orange)]/[0.04]' : 'text-gray-600'}`}
                                                >
                                                    {year}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
                                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Live</span>
                            </div>
                        </div>
                    </header>
                </PageItem>

                {/* ── Hero Grid ──────────────────────────────────────── */}
                <PageItem className="mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">

                        {/* Primary Balance Card */}
                        <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-500/20 p-7 md:p-8 shadow-sm rounded-2xl relative overflow-hidden group text-white">
                            {/* Ambient layers */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none" />

                            {/* Top row */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-3 bg-white/10 rounded-2xl border border-white/15 shadow-sm">
                                    <Wallet className="text-amber-300 fill-amber-300/20" size={26} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-bold text-blue-200/50 uppercase tracking-[0.2em] mb-1.5">Account</p>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white text-[9px] font-bold uppercase tracking-wider">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm animate-pulse" />
                                        Synchronized
                                    </div>
                                </div>
                            </div>

                            {/* Main figure */}
                            <p className="text-[10px] font-black text-blue-100/60 uppercase tracking-[0.3em] mb-2">
                                Confirmed Residual Yield
                            </p>
                            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter tabular-nums leading-none font-heading">
                                ₹{stats.totalEarned.toLocaleString('en-IN')}
                            </h2>

                            {/* Sub-metrics */}
                            <div className="grid grid-cols-2 gap-3 mt-8">
                                {/* Settled */}
                                <div className="p-5 rounded-2xl bg-white/10 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all text-white">
                                    <p className="text-[9px] font-black text-blue-100/60 uppercase tracking-[0.2em] mb-3">
                                        {isWaiverUser ? 'Applied Credits' : 'Paid Settlements'}
                                    </p>
                                    <div className="flex items-end justify-between">
                                        <p className="text-2xl md:text-3xl font-black text-white tabular-nums tracking-tighter font-heading">
                                            ₹{stats.totalSettled.toLocaleString('en-IN')}
                                        </p>
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                                            <CheckCircle2 size={15} />
                                        </div>
                                    </div>
                                </div>

                                {/* Pending */}
                                <div className="p-5 rounded-2xl bg-white/10 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all text-white">
                                    <p className="text-[9px] font-black text-blue-100/60 uppercase tracking-[0.2em] mb-3">
                                        Pending Balance
                                    </p>
                                    <div className="flex items-end justify-between">
                                        <p className="text-2xl md:text-3xl font-black text-white tabular-nums tracking-tighter font-heading">
                                            ₹{stats.remainingBalance.toLocaleString('en-IN')}
                                        </p>
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 animate-pulse">
                                            <Clock size={15} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Referral Efficiency Card */}
                        <div className="bg-white border border-gray-300 p-6 flex flex-col justify-between shadow-sm rounded-2xl text-gray-800 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/30 to-transparent opacity-85" />
                            <div>
                                <div className="flex items-center justify-between mb-5">
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                        Referral Efficiency
                                    </p>
                                    {/* 3D sphere badge */}
                                    <div className="bg-gradient-to-br from-orange-300 via-[var(--primary-orange)] to-orange-700 shadow-[0_8px_20px_rgba(249,115,22,0.25),inset_0_2px_3px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.2)] text-white w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                                        <TrendingUp size={14} />
                                    </div>
                                </div>

                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-4xl font-black text-gray-800 tabular-nums leading-none font-heading">
                                        {stats.referralCount}
                                    </span>
                                    <span className="text-[10px] font-black text-gray-600 uppercase pb-1">Units</span>
                                </div>
                                <p className="text-[9px] text-gray-500 leading-relaxed uppercase font-bold tracking-[0.05em]">
                                    Confirmed in academic cycle
                                </p>
                            </div>

                            <div className="mt-6">
                                <AccessibleProgressBar 
                                    progress={((stats.referralCount % 5 || stats.referralCount) / 5) * 100}
                                    label="Referral Efficiency Progress"
                                    colorClasses="bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)]"
                                    className="!bg-gray-100 h-2"
                                />
                            </div>
                            <div className="flex justify-between text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em] mt-1">
                                <span>Milestone {Math.floor(stats.referralCount / 5) * 5}</span>
                                <span>Next: {(Math.floor(stats.referralCount / 5) + 1) * 5}</span>
                            </div>

                            {/* Referral yield vs bonus credits */}
                            {stats.bonusCredits > 0 && (
                                <div className="mt-5 pt-4 border-t border-gray-150 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Referral Yield</span>
                                        <span className="text-[10px] font-black text-gray-800">₹{stats.referralYield.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Bonus Credits</span>
                                        <span className="text-[10px] font-black text-emerald-600">+₹{stats.bonusCredits.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </PageItem>

                {/* ── Earning Components Breakdown ───────────────────── */}
                <PageItem className="mb-10">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <PieChart size={13} className="text-[var(--primary-orange)]" />
                        Earning Breakdown
                    </h3>

                    {stats.breakdown.length === 0 ? (
                        <div className="py-10 text-center border border-dashed border-gray-300 rounded-2xl bg-white shadow-sm">
                            <IndianRupee className="mx-auto text-gray-400 mb-3" size={32} />
                            <p className="text-gray-600 font-bold text-[9px] uppercase tracking-widest">
                                No earning components yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {stats.breakdown.map((item, idx) => {
                                const { label, amount } = parseBreakdownItem(item)
                                return (
                                    <div
                                        key={idx}
                                        className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-200 hover:border-[var(--primary-orange)]/30 transition-all duration-200 shadow-sm hover:bg-gray-50"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-200 group-hover:bg-[var(--primary-orange)]/10 group-hover:border-[var(--primary-orange)]/25 transition-all shrink-0 text-gray-600">
                                            {getBreakdownIcon(label)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider truncate">
                                                {label}
                                            </p>
                                        </div>
                                        <div className="text-sm font-black text-gray-800 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 shrink-0">
                                            {amount}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </PageItem>

                {/* ── Settlement History ──────────────────────────────── */}
                <PageItem className="mb-8">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <History size={13} className="text-[var(--primary-orange)]" />
                        Transaction History
                    </h3>

                    {(!stats.settlements || stats.settlements.length === 0) ? (
                        <div className="py-16 text-center border border-dashed border-gray-300 rounded-2xl bg-white shadow-sm">
                            <Clock className="mx-auto text-gray-400 mb-4" size={40} />
                            <p className="text-gray-600 font-bold text-[9px] uppercase tracking-widest">
                                No settlements processed yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {stats.settlements.map((s) => (
                                <div
                                    key={s.id}
                                    className="group p-5 rounded-2xl bg-white border border-gray-200 hover:border-[var(--primary-orange)]/30 transition-all duration-200 shadow-sm hover:bg-gray-50"
                                >
                                    {/* Row header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Status icon */}
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${s.status === 'Processed'
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                                : 'bg-amber-50 border-amber-200 text-amber-600'
                                                }`}>
                                                {s.status === 'Processed' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                                            </div>

                                            <div>
                                                <p className="text-sm font-black text-gray-800 tracking-tight uppercase leading-none mb-1.5 font-heading">
                                                    Settlement #{s.id}
                                                </p>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={11} className="text-gray-550" />
                                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.15em]" suppressHydrationWarning>
                                                        {formatDate(s.payoutDate || s.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Amount + badge */}
                                        <div className="text-right">
                                            <div className={`text-xl font-black tabular-nums tracking-tighter leading-none mb-2 font-heading ${s.status === 'Processed' ? 'text-gray-800' : 'text-amber-600'}`}>
                                                ₹{s.amount.toLocaleString('en-IN')}
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md border inline-block ${s.status === 'Processed'
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                                : 'bg-amber-50 border-amber-200 text-amber-600'
                                                }`}>
                                                {s.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bank reference */}
                                    {s.bankReference && (
                                        <div className="mt-4 pt-4 border-t border-gray-150 flex flex-col sm:flex-row sm:items-center gap-3">
                                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] whitespace-nowrap">
                                                Ref:
                                            </span>
                                            <div className="flex-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200">
                                                <span className="font-mono text-[11px] font-bold text-gray-600 tracking-tight leading-none break-all">
                                                    {s.bankReference}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </PageItem>

                {/* ── Footer Note ────────────────────────────────────── */}
                <PageItem>
                    <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                        <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 leading-relaxed font-medium">
                            Settlements are processed in institutional reconciliation cycles — typically within
                            7–10 working days of approval. Waiver credits are applied directly to your child&apos;s fee ledger.
                        </p>
                    </div>
                </PageItem>

            </PageAnimate>
        </div>
    )
}
