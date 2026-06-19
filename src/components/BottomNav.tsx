'use client'

import { Home, UserPlus, List, User, IndianRupee } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export function BottomNav({ role }: { role?: string }) {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/' || path === '/dashboard' || path === '/campus' || path === '/superadmin' || path === '/admin' || path === '/finance') {
            // Match any root dashboard path
            return pathname === path || (pathname === '/' && path === '/dashboard')
        }
        return pathname.startsWith(path)
    }

    const isFinanceAccess = role === 'Finance Admin' || role === 'Super Admin'

    const isAmbassador = role === 'Staff' || role === 'Parent' || role === 'Alumni' || role === 'Others'

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 xl:hidden">
            {/* Gradient Glow at top */}
            {!isAmbassador && (
                <div className="absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            )}

            {/* Main Bar */}
            <div className={`pb-[env(safe-area-inset-bottom)] backdrop-blur-xl ${
                isAmbassador 
                    ? 'bg-white/95 border-t border-[var(--warm-gray)] shadow-[0_-5px_15px_rgba(0,0,0,0.05)]' 
                    : 'bg-[#0f172a]/95 border-t border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]'
            }`}>
                <div className={`flex justify-around items-center h-16 ${isFinanceAccess ? 'px-2' : ''} px-4`}>
                    <Link
                        href="/dashboard"
                        className={`group flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
                            pathname.includes('dashboard') || pathname === '/' || pathname.includes('admin') || pathname.includes('campus') || pathname.includes('superadmin') 
                                ? isAmbassador ? 'text-[var(--primary-orange)]' : 'text-white' 
                                : isAmbassador ? 'text-[var(--text-gray)] hover:text-[var(--deep-black)]' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <div className={`p-1.5 transition-all duration-300 ${
                            isAmbassador ? 'rounded-md' : 'rounded-full'
                        } ${
                            pathname.includes('dashboard') || pathname === '/' || pathname.includes('admin') || pathname.includes('campus') || pathname.includes('superadmin') 
                                ? isAmbassador ? 'bg-[var(--primary-orange)]/10' : 'bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
                                : isAmbassador ? 'group-hover:bg-[var(--soft-gray)]' : 'group-hover:bg-white/5'
                        }`}>
                            <Home size={20} className={
                                pathname.includes('dashboard') || pathname === '/' || pathname.includes('admin') || pathname.includes('campus') || pathname.includes('superadmin') 
                                    ? isAmbassador ? 'text-[var(--primary-orange)]' : 'text-blue-300' 
                                    : isAmbassador ? 'text-[var(--text-gray)] group-hover:text-[var(--deep-black)]' : 'text-slate-400 group-hover:text-blue-200'
                            } strokeWidth={pathname.includes('dashboard') ? 2.5 : 2} />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
                    </Link>

                    {isFinanceAccess && (
                        <Link
                            href="/finance"
                            className={`group flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${isActive('/finance') ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <div className={`p-1.5 rounded-full transition-all duration-300 ${isActive('/finance') ? 'bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'group-hover:bg-white/5'}`}>
                                <IndianRupee size={20} className={isActive('/finance') ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-300'} strokeWidth={isActive('/finance') ? 2.5 : 2} />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider">Finance</span>
                        </Link>
                    )}

                    {/* Prominent Refer Button - Floating */}
                    <div className="relative -top-5">
                        <Link
                            href="/refer"
                            className={`flex flex-col items-center justify-center transition-all duration-300 relative group ${
                                isAmbassador 
                                    ? 'w-14 h-14 rounded-md bg-gradient-to-br from-[var(--primary-orange)] to-[var(--primary-orange-hover)] shadow-lg border-2 border-white hover:scale-105 active:scale-95' 
                                    : 'w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl border-4 border-[#0f172a] hover:scale-105 active:scale-95'
                            }`}
                        >
                            <div className={`absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity ${isAmbassador ? 'rounded-md' : 'rounded-full'}`} />
                            <UserPlus size={24} className="text-white relative z-10" strokeWidth={2.5} />
                        </Link>
                        <span className={`absolute -bottom-5 w-full text-center text-[9px] font-bold uppercase tracking-wider transition-colors ${
                            isAmbassador ? 'text-[var(--primary-orange)]' : 'text-slate-400 group-hover:text-white'
                        }`}>Refer</span>
                    </div>

                    <Link
                        href="/profile"
                        className={`group flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
                            isActive('/profile') 
                                ? isAmbassador ? 'text-[var(--primary-orange)]' : 'text-white' 
                                : isAmbassador ? 'text-[var(--text-gray)] hover:text-[var(--deep-black)]' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <div className={`p-1.5 transition-all duration-300 ${
                            isAmbassador ? 'rounded-md' : 'rounded-full'
                        } ${
                            isActive('/profile') 
                                ? isAmbassador ? 'bg-[var(--primary-orange)]/10' : 'bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
                                : isAmbassador ? 'group-hover:bg-[var(--soft-gray)]' : 'group-hover:bg-white/5'
                        }`}>
                            <User size={20} className={
                                isActive('/profile') 
                                    ? isAmbassador ? 'text-[var(--primary-orange)]' : 'text-blue-300' 
                                    : isAmbassador ? 'text-[var(--text-gray)] group-hover:text-[var(--deep-black)]' : 'text-slate-400 group-hover:text-blue-200'
                            } strokeWidth={isActive('/profile') ? 2.5 : 2} />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider">Profile</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
