'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useSidebar } from './MobileSidebarWrapper'

interface NavItem {
    label: string
    href: string
    icon: React.ReactNode
}

interface UserProfile {
    fullName: string
    role: string
}

interface SidebarUIProps {
    navItems: NavItem[]
    user: UserProfile
    logoutAction: () => Promise<void>
    onNavigate?: () => void
    viewMode?: 'mobile-grid' | 'desktop-list'
    hideLogo?: boolean
}

export function MobileMenu({ navItems, user, logoutAction, onNavigate: propOnNavigate, viewMode: propViewMode, hideLogo = false }: SidebarUIProps) {
    const sidebarContext = useSidebar()

    // Priority: Context -> Props -> Default
    const viewMode = sidebarContext?.viewMode || propViewMode || 'desktop-list'
    const isMobile = viewMode === 'mobile-grid'
    const pathname = usePathname() || ''
    const searchParams = useSearchParams()

    const isAmbassador = user.role === 'Staff' || user.role === 'Parent' || user.role === 'Alumni' || user.role === 'Others'

    return (
        <div className="flex flex-col h-full bg-transparent font-[family-name:var(--font-outfit)]">


            {/* Navigation Items - Premium Grid for Mobile */}
            <nav className={`flex-1 overflow-y-auto px-3 pt-3 pb-3 ${isMobile ? 'grid grid-cols-2 gap-2 content-start' : 'space-y-1'}`}>
                {navItems.map((item) => {
                    // Safe active check logic with Query Param support
                    let isActive = false
                    if (pathname) {
                        try {
                            const itemUrl = new URL(item.href, 'http://dummy.com') // safe parsing for relative urls
                            const itemPath = itemUrl.pathname
                            const itemView = itemUrl.searchParams.get('view')
                            const currentView = searchParams?.get('view')

                            if (itemView) {
                                // If item needs a specific view, check if we match path AND view
                                isActive = pathname === itemPath && currentView === itemView
                            } else {
                                // If item is just a base path (like Home), matches if path matches AND no specific view is selected (or we are in a sub-path)
                                // Exception: Dashboard usually means "no view"
                                isActive = pathname === itemPath && !currentView
                            }


                        } catch (e) {
                            // Fallback to simple string check
                            isActive = pathname === item.href
                        }
                    }

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={isMobile
                                // Mobile: Royal Glass Theme - Compact Grid (2 Cols)
                                ? `flex items-center gap-2 px-3 py-2.5 transition-all duration-300 group no-underline relative overflow-hidden ${
                                    isAmbassador ? 'rounded-md' : 'rounded-xl'
                                } ${isActive
                                    ? isAmbassador
                                        ? 'bg-[var(--primary-orange)]/10 border-[var(--primary-orange)]/30 shadow-none text-[var(--primary-orange)]'
                                        : 'bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                                    : isAmbassador
                                        ? 'bg-white border border-[var(--warm-gray)] text-[var(--text-gray)] hover:bg-[var(--soft-gray)]'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-blue-200/60'
                                }`
                                // Desktop List Item Styles (Premium Sidebar)
                                : `flex items-center gap-3 px-4 py-3.5 transition-all group relative overflow-hidden no-underline ${
                                    isAmbassador ? 'rounded-md' : 'rounded-2xl'
                                } ${
                                    isActive 
                                        ? isAmbassador
                                            ? 'text-[var(--primary-orange)] bg-[var(--primary-orange)]/5 font-black border border-[var(--primary-orange)]/15 shadow-sm'
                                            : 'text-amber-500 bg-white/[0.05] font-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                                        : isAmbassador
                                            ? 'text-[var(--text-gray)] hover:text-[var(--deep-black)]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                                }`
                            }
                        >
                            {/* Mobile Active Shine */}
                            {isMobile && isActive && !isAmbassador && (
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-amber-400/20 to-transparent opacity-40 skew-x-12" />
                            )}

                            {!isMobile && (
                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-500 transition-transform duration-500 ${isAmbassador ? 'bg-[var(--primary-orange)] rounded-r-md shadow-[0_0_10px_rgba(242,110,33,0.4)]' : 'bg-amber-500 rounded-r-full shadow-[0_0_15px_rgba(245,158,11,0.8)]'} ${isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />
                            )}

                            {/* Icon - Sharpened for Premium */}
                            {React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<any>, {
                                size: isMobile ? 22 : 20,
                                className: `flex-shrink-0 transition-all duration-500 relative z-10 ${isMobile
                                    ? isActive 
                                        ? isAmbassador ? 'text-[var(--primary-orange)]' : 'text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]' 
                                        : isAmbassador ? 'text-[var(--text-gray)] group-hover:text-[var(--deep-black)]' : 'text-white/40 group-hover:text-white'
                                    : (isActive
                                        ? isAmbassador ? 'text-[var(--primary-orange)] scale-110' : 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] scale-110'
                                        : isAmbassador ? 'text-[var(--text-gray)] group-hover:text-[var(--deep-black)] group-hover:scale-110' : 'text-gray-500 group-hover:text-white group-hover:scale-110')}`
                            }) : item.icon}

                            <span style={{
                                fontSize: isMobile ? '13px' : '12px',
                                fontWeight: isActive ? '900' : '700',
                                letterSpacing: '0.02em',
                                color: isMobile 
                                    ? (isActive 
                                        ? isAmbassador ? 'var(--primary-orange)' : '#f59e0b' 
                                        : isAmbassador ? 'var(--text-gray)' : 'rgba(255,255,255,0.4)') 
                                    : 'inherit',
                                textTransform: 'uppercase',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                zIndex: 10,
                                position: 'relative'
                            }} className={isMobile && !isActive ? 'group-hover:text-[var(--deep-black)] transition-colors' : (isActive ? 'drop-shadow-sm' : 'group-hover:text-[var(--deep-black)] transition-colors text-slate-500')}>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Compact Footer (Profile + Logout) */}
            <div className={`mt-auto px-4 py-6 border-t ${isMobile ? 'backdrop-blur-lg' : ''} ${isAmbassador ? 'border-[var(--warm-gray)] bg-gray-50/50' : 'border-white/10 bg-black/20'}`}>
                <div className={`flex flex-col items-center justify-between gap-4 ${isMobile ? '' : 'flex-col items-stretch'}`}>
                    <Link href="/profile" className={`flex items-center mb-3 gap-4 transition-all no-underline text-inherit ${isMobile ? 'flex-1' : ''} ${isAmbassador ? 'bg-white hover:bg-gray-50 border border-[var(--warm-gray)] rounded-md p-3 shadow-sm' : 'bg-white/5 hover:bg-white/10 rounded-2xl p-3 border border-white/5'}`}>
                        <div
                            className={`w-[48px] h-[48px] flex items-center justify-center text-lg font-black text-white shadow-2xl flex-shrink-0 ring-2 relative overflow-hidden ${
                                isAmbassador ? 'rounded-md ring-gray-150 bg-gradient-to-br from-[var(--primary-orange)] to-[var(--primary-orange-hover)]' : 'rounded-xl ring-white/10 bg-gradient-to-br from-indigo-600 to-sky-500'
                            }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                            {user.fullName[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                            <span
                                className={`font-black truncate text-sm tracking-tight leading-none ${isAmbassador ? 'text-[var(--deep-black)]' : 'text-white'}`}
                                style={{ maxWidth: '160px' }}
                            >
                                {user.fullName}
                            </span>
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <span className={`text-[10px] font-black uppercase tracking-[0.15em] leading-none ${isAmbassador ? 'text-[var(--primary-orange)]' : 'text-blue-400'}`}>{user.role}</span>
                                <div className={`w-1 h-1 rounded-full ${isAmbassador ? 'bg-gray-300' : 'bg-slate-700'}`} />
                                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${isAmbassador ? 'text-emerald-700 bg-emerald-100/60 border-emerald-200' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'}`}>Verified</span>
                            </div>
                        </div>
                    </Link>
                    <button
                        onClick={async () => {
                            await logoutAction()
                            window.location.href = '/'
                        }}
                        style={{ cursor: 'pointer' }}
                        suppressHydrationWarning={true}
                        className={`w-full flex items-center justify-center gap-3 px-5 py-3 transition-all text-[11px] font-black uppercase tracking-[0.2em] group shadow-inner ${isMobile ? '' : 'mt-4'} ${
                            isAmbassador ? 'rounded-md bg-white border border-[var(--warm-gray)] text-[var(--text-gray)] hover:text-red-600 hover:bg-red-50' : 'rounded-2xl bg-white/[0.03] text-blue-200 hover:text-white hover:bg-red-500/20 border border-white/10'
                        }`}
                    >
                        <LogOut size={16} className="group-hover:translate-x-[-3px] transition-transform text-red-500/60 group-hover:text-red-500" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
