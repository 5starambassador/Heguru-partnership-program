import { getCurrentUser } from '@/lib/auth-service'
import { Star, CheckCircle2, Trophy, ArrowRight, ShieldCheck, Wallet, Info, ChevronLeft } from 'lucide-react'
import { PageAnimate, PageItem } from '@/components/PageAnimate'
import Link from 'next/link'

import { getBenefitSlabs } from '@/app/benefit-actions'

export default async function RulesPage() {
    const slabsResult = await getBenefitSlabs()
    const rawSlabs = slabsResult.data || []

    // Sort and format for display
    const sortedSlabs = [...rawSlabs].sort((a, b) => a.referralCount - b.referralCount)

    const benefits = sortedSlabs.map(s => ({
        count: s.referralCount,
        percent: s.yearFeeBenefitPercent,
        label: s.tierName || `Tier ${s.referralCount}`,
        longTermBase: s.baseLongTermPercent
    }))

    // Global policy (assume first slab contains global settings)
    const globalBase = rawSlabs[0]?.baseLongTermPercent || 15
    const globalYield = 5 // Institutional protocol is linear 5% for long term

    const getTierTheme = (tier: string) => {
        switch (tier) {
            case 'Starter': 
                return {
                    bg: 'bg-white',
                    border: 'border-slate-200 hover:border-slate-300',
                    accent: 'bg-slate-500',
                    text: 'text-slate-700',
                    percentText: 'text-slate-800',
                    tagBg: 'bg-slate-50 border-slate-200 text-slate-600'
                }
            case 'Bronze':
                return {
                    bg: 'bg-gradient-to-br from-amber-50/40 to-orange-50/10',
                    border: 'border-orange-200 hover:border-orange-300',
                    accent: 'bg-[var(--primary-orange)]',
                    text: 'text-orange-800',
                    percentText: 'text-orange-900',
                    tagBg: 'bg-orange-50 border-orange-200 text-[var(--primary-orange)]'
                }
            case 'Silver':
                return {
                    bg: 'bg-white',
                    border: 'border-slate-300 hover:border-slate-400',
                    accent: 'bg-slate-400',
                    text: 'text-slate-700',
                    percentText: 'text-slate-800',
                    tagBg: 'bg-slate-100 border-slate-200 text-slate-600'
                }
            case 'Gold':
                return {
                    bg: 'bg-gradient-to-br from-yellow-50/40 to-amber-50/15',
                    border: 'border-amber-300 hover:border-amber-400',
                    accent: 'bg-amber-500',
                    text: 'text-amber-800',
                    percentText: 'text-amber-900',
                    tagBg: 'bg-amber-50 border-amber-200 text-amber-700'
                }
            case 'Platinum':
                return {
                    bg: 'bg-gradient-to-br from-blue-50/40 to-indigo-50/15',
                    border: 'border-blue-300 hover:border-blue-400',
                    accent: 'bg-blue-500',
                    text: 'text-blue-800',
                    percentText: 'text-blue-900',
                    tagBg: 'bg-blue-50 border-blue-200 text-blue-700'
                }
            default:
                return {
                    bg: 'bg-white',
                    border: 'border-slate-200 hover:border-slate-300',
                    accent: 'bg-slate-500',
                    text: 'text-slate-700',
                    percentText: 'text-slate-800',
                    tagBg: 'bg-slate-50 border-slate-200 text-slate-600'
                }
        }
    }

    return (
        <div className="relative font-[family-name:var(--font-outfit)]">
            <PageAnimate className="max-w-4xl mx-auto space-y-8 pb-12 relative z-10">

                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-slate-100 hover:border-gray-300 transition-colors shadow-sm shrink-0">
                            <ChevronLeft size={20} className="text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--deep-black)] uppercase italic font-heading">Program Rules</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Operational Protocol & Reward Algorithms</p>
                        </div>
                    </div>
                </header>

                {/* How it Works - Unified Light Card */}
                <PageItem className="bg-white border border-gray-200 rounded-xl p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/20 to-transparent opacity-40" />
                    
                    <h2 className="text-lg font-black mb-6 text-slate-800 uppercase tracking-wider flex items-center gap-3 font-heading">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
                            <Info size={16} />
                        </div>
                        How it works
                    </h2>

                    <ul className="space-y-5 text-sm font-medium text-slate-600">
                        <li className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20">
                                <span className="text-amber-600 font-bold text-xs">1</span>
                            </div>
                            <span className="leading-relaxed">Refer parents to Heguru using your unique code or link. If they join, you earn points towards your tier.</span>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20">
                                <span className="text-amber-600 font-bold text-xs">2</span>
                            </div>
                            <span className="leading-relaxed">
                                Benefits apply directly to your <span className="text-slate-900 font-bold">Child's Fee</span> (for Parents) or <span className="text-slate-900 font-bold">Bank Transfer</span> (for Staff/Alumni).
                            </span>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20">
                                <span className="text-amber-600 font-bold text-xs">3</span>
                            </div>
                            <span className="leading-relaxed">
                                <span className="text-amber-600 font-bold uppercase tracking-wider text-xs font-heading">Activation Rule:</span> Just <span className="text-slate-900 font-bold">1 Confirmed Referral</span> per year keeps your benefits active.
                            </span>
                        </li>
                    </ul>
                </PageItem>

                {/* Immediate Benefits (Tier Grid) */}
                <PageItem>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-6 w-1 bg-gradient-to-b from-[var(--primary-orange)] to-orange-400 rounded-full" />
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight font-heading">Tier Benefits</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {benefits.map((b) => {
                            const theme = getTierTheme(b.label)
                            return (
                                <div
                                    key={b.count}
                                    className={`relative p-6 rounded-xl border transition-all duration-300 group overflow-hidden ${theme.bg} ${theme.border} hover:shadow-md hover:-translate-y-1`}
                                >
                                    {/* Subtle Top Accent line matching tier */}
                                    <div className={`absolute top-0 left-0 w-full h-[2.5px] ${theme.accent}`} />

                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border ${theme.tagBg}`}>
                                            {b.label}
                                        </span>
                                    </div>

                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className={`text-5xl font-black tracking-tighter font-heading ${theme.percentText}`}>
                                            {b.percent}%
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fee Benefit</p>

                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                                        <span className="uppercase tracking-wider text-[10px] text-slate-400 font-bold">Requirement</span>
                                        <span className="text-slate-800 font-black tracking-tight font-heading">
                                            {b.count} Referral{b.count > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </PageItem>

                {/* Elite Status Section */}
                <PageItem className="bg-white border border-gray-200 rounded-xl p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/20 to-transparent opacity-40" />
                    
                    <div className="relative z-10 w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
                                <Star className="fill-amber-500 text-amber-500" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight font-heading">
                                    Elite Status (Long Term)
                                </h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Partner Program Privileges</p>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm font-medium mb-6 max-w-xl leading-relaxed">
                            Qualify for Long Term Benefits next year by completing 5 Referrals this year. Unlock the prestigious Partner status.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex justify-between items-center p-5 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100/70 transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 font-heading">Base Benefit</span>
                                    <span className="text-[11px] text-slate-400 font-bold">Guaranteed Historic Base Sum</span>
                                </div>
                                <span className="font-black text-2xl text-slate-700">🏛️</span>
                            </div>
                            <div className="flex justify-between items-center p-5 bg-emerald-50/50 rounded-xl border border-emerald-200 hover:bg-emerald-50 transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1 font-heading">New Referral Yield</span>
                                    <span className="text-[11px] text-emerald-600 font-bold">Linear Protocol</span>
                                </div>
                                <span className="font-black text-2xl text-emerald-600">+{globalYield}% <span className="text-xs align-top opacity-80 italic">Yield</span></span>
                            </div>
                        </div>

                        <p className="text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-[0.1em] text-center w-full">
                            * Required: 1 referral in new year to unlock
                        </p>
                    </div>
                </PageItem>

                {/* Dates Panel */}
                <PageItem className="bg-rose-50/50 rounded-xl p-6 border border-rose-200/80 text-center relative overflow-hidden shadow-sm">
                    <div className="relative z-10">
                        <p className="font-black text-base text-rose-950 uppercase tracking-tight mb-1 font-heading">
                            Registration closes <span className="text-[var(--primary-orange)] font-extrabold">31 January 2026</span>
                        </p>
                        <p className="text-[10px] text-rose-600/80 font-bold uppercase tracking-widest">
                            பதிவு கடைசி தேதி: 31 ஜனவரி 2026
                        </p>
                    </div>
                </PageItem>

            </PageAnimate>
        </div>
    )
}
