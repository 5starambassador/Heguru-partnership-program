'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react'

interface NavItem {
    label: string
    href: string
    icon: React.ReactNode
}

interface CollapsibleSidebarProps {
    navItems: NavItem[]
    user: { fullName: string; role: string }
    logoutAction: () => Promise<void>
}

const STORAGE_KEY = 'sidebar_collapsed'

export function CollapsibleSidebar({ navItems, user, logoutAction }: CollapsibleSidebarProps) {
    const [collapsed, setCollapsed] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [tooltip, setTooltip] = useState<{ label: string; y: number } | null>(null)
    const pathname = usePathname() || ''
    const searchParams = useSearchParams()

    // Read from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'true') setCollapsed(true)
        setMounted(true)
    }, [])

    const toggle = () => {
        const next = !collapsed
        setCollapsed(next)
        localStorage.setItem(STORAGE_KEY, String(next))
    }

    const isActive = (href: string) => {
        try {
            const itemUrl = new URL(href, 'http://dummy.com')
            const itemPath = itemUrl.pathname
            const itemView = itemUrl.searchParams.get('view')
            const currentView = searchParams?.get('view')
            if (itemView) return pathname === itemPath && currentView === itemView
            return pathname === itemPath && !currentView
        } catch {
            return pathname === href
        }
    }

    const sidebarWidth = collapsed ? '64px' : '280px'

    const isAmbassador = user.role === 'Staff' || user.role === 'Parent' || user.role === 'Alumni' || user.role === 'Others'

    // Don't flash to wide on first render before localStorage is read
    if (!mounted) return null

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`desktop-sidebar hidden xl:flex flex-col p-0 fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 ease-in-out ${collapsed ? 'w-[64px]' : 'w-[280px]'} ${
                    isAmbassador 
                        ? 'bg-white border-r border-[var(--warm-gray)] shadow-sm' 
                        : 'bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] border-r border-white/10 shadow-[20px_0_80px_rgba(0,0,0,0.8)]'
                }`}
            >
                {/* Royal accents */}
                <div className={`absolute top-0 right-0 w-[1px] h-full ${isAmbassador ? 'bg-gray-100' : 'bg-gradient-to-b from-transparent via-white/20 to-transparent'}`} />
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

                {/* Logo area */}
                <div className={`flex flex-col items-center pt-6 pb-4 transition-all duration-300 ${collapsed ? 'px-1' : 'px-2'}`}>
                    <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-500 mb-6">
                        <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 via-amber-500 to-red-500 blur opacity-25 group-hover:opacity-60 transition duration-1000 ${isAmbassador ? 'rounded-md' : 'rounded-2xl'}`} />
                        <img
                            src="/images/HEGURU-JAPAN-LOGO.jpeg"
                            alt="Heguru"
                            className={`relative object-contain shadow-2xl transition-all duration-300 ${isAmbassador ? 'rounded-md' : ''} ${collapsed ? 'h-[40px] w-auto' : 'h-[80px] w-auto max-w-[180px]'}`}
                        />
                    </div>
                    {!collapsed && (
                        <div className="text-center ">
                            <h2 className={`text-md font-black tracking-tight  leading-tight ${isAmbassador ? 'text-[var(--deep-black)]' : 'text-white'}`}>Heguru Partnership Program</h2>
                            {/* <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isAmbassador ? 'text-[var(--text-gray)]' : 'text-indigo-200/70'}`}>Partnership Program</p> */}
                            {/* <p className={`text-[9px] uppercase tracking-[0.25em] font-black ${isAmbassador ? 'text-[var(--primary-orange)]' : 'text-amber-400'}`}>
                                25<sup className="text-[0.6em]">th</sup> Year Celebration
                            </p> */}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="px-4 mb-4">
                    <div className={`h-px w-full ${isAmbassador ? 'bg-gray-200' : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'}`} />
                </div>

                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none px-2 space-y-0.5 pb-2">
                    {navItems.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <div key={item.label} className="relative group/item">
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 transition-all duration-200 relative overflow-hidden no-underline
                                        ${collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'}
                                        ${isAmbassador 
                                            ? 'rounded-md' 
                                            : 'rounded-2xl'
                                        }
                                        ${active
                                            ? isAmbassador 
                                                ? 'text-[var(--primary-orange)] bg-[var(--primary-orange)]/5 font-black border border-[var(--primary-orange)]/15 shadow-sm'
                                                : 'text-amber-500 bg-white/[0.06] font-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                                            : isAmbassador
                                                ? 'text-[var(--text-gray)] hover:text-[var(--deep-black)] hover:bg-[var(--soft-gray)]'
                                                : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                                        }`}
                                    onMouseEnter={(e) => {
                                        if (collapsed) {
                                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                                            setTooltip({ label: item.label, y: rect.top + rect.height / 2 })
                                        }
                                    }}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    {/* Active bar */}
                                    {!collapsed && (
                                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 transition-transform duration-500 
                                            ${isAmbassador 
                                                ? 'bg-[var(--primary-orange)] rounded-r-md shadow-[0_0_10px_rgba(242,110,33,0.4)]' 
                                                : 'bg-amber-500 rounded-r-full shadow-[0_0_15px_rgba(245,158,11,0.8)]'
                                            } ${active ? 'scale-y-100' : 'scale-y-0 group-hover/item:scale-y-100'}`} />
                                    )}
                                    {/* Icon */}
                                    {React.isValidElement(item.icon)
                                        ? React.cloneElement(item.icon as React.ReactElement<any>, {
                                            size: 20,
                                            className: `flex-shrink-0 transition-all duration-300 relative z-10
                                                ${active
                                                    ? isAmbassador
                                                        ? 'text-[var(--primary-orange)] scale-110'
                                                        : 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] scale-110'
                                                    : isAmbassador
                                                        ? 'text-[var(--text-gray)] group-hover/item:text-[var(--deep-black)] group-hover/item:scale-110'
                                                        : 'text-gray-500 group-hover/item:text-white group-hover/item:scale-110'}`
                                        })
                                        : item.icon}
                                    {/* Label */}
                                    {!collapsed && (
                                        <span className={`text-[11px] font-bold uppercase tracking-[0.05em] truncate relative z-10 transition-colors duration-200
                                            ${active 
                                                ? isAmbassador
                                                    ? 'text-[var(--primary-orange)]'
                                                    : 'text-amber-500' 
                                                : isAmbassador
                                                    ? 'text-[var(--text-gray)] group-hover/item:text-[var(--deep-black)]'
                                                    : 'text-slate-400 group-hover/item:text-white'}`}>
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        )
                    })}
                </nav>

                {/* Floating tooltip for collapsed mode */}
                {collapsed && tooltip && (
                    <div className="fixed z-[200] pointer-events-none left-[72px] -translate-y-1/2 top-[var(--tooltip-y)]">
                        <style>{`
                            :root { --tooltip-y: ${tooltip.y}px; }
                        `}</style>
                        <div className="bg-gray-900 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-xl border border-white/10 whitespace-nowrap">
                            {tooltip.label}
                        </div>
                        <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-r-[5px] border-t-transparent border-b-transparent border-r-gray-900" />
                    </div>
                )}

                {/* Footer */}
                <div className={`md:hidden fixed inset-0 bg-black/50 z-[45] transition-opacity duration-300 ${!collapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggle} />
                <div className={`mt-auto border-t transition-all duration-300 ${collapsed ? 'px-1 py-3' : 'px-4 py-4'} ${isAmbassador ? 'border-[var(--warm-gray)] bg-gray-50/50' : 'border-white/10 bg-black/20'}`}>
                    {collapsed ? (
                        // Collapsed footer: avatar only
                        <div className="flex flex-col items-center gap-2">
                            <Link href="/profile" className="no-underline" title={user.fullName}>
                                <div className={`w-9 h-9 flex items-center justify-center text-sm font-black text-white shadow-xl ${isAmbassador ? 'rounded-md ring-2 ring-gray-150 bg-gradient-to-br from-[var(--primary-orange)] to-[var(--primary-orange-hover)]' : 'rounded-xl ring-2 ring-white/10 bg-gradient-to-br from-indigo-600 to-sky-500'}`}>
                                    {user.fullName[0].toUpperCase()}
                                </div>
                            </Link>
                            <button
                                onClick={async () => { await logoutAction(); window.location.href = '/' }}
                                className={`w-full flex items-center justify-center p-2 transition-all ${isAmbassador ? 'rounded-md bg-white border border-[var(--warm-gray)] text-red-500 hover:bg-red-50' : 'rounded-xl bg-white/[0.03] text-red-500/60 hover:text-red-500 hover:bg-red-500/10 border border-white/10'}`}
                                title="Logout"
                            >
                                <LogOut size={15} />
                            </button>
                        </div>
                    ) : (
                        // Expanded footer
                        <div className="flex flex-col gap-3">
                            <Link href="/profile" className={`flex items-center gap-3 transition-all no-underline text-inherit ${isAmbassador ? 'bg-white border border-[var(--warm-gray)] rounded-md p-3 shadow-sm hover:bg-gray-50' : 'bg-white/5 hover:bg-white/10 rounded-2xl p-3 border border-white/5'}`}>
                                <div className={`w-10 h-10 flex items-center justify-center text-base font-black text-white shadow-xl flex-shrink-0 ${isAmbassador ? 'rounded-md ring-2 ring-gray-100 bg-gradient-to-br from-[var(--primary-orange)] to-[var(--primary-orange-hover)]' : 'rounded-xl ring-2 ring-white/10 bg-gradient-to-br from-indigo-600 to-sky-500'}`}>
                                    {user.fullName[0].toUpperCase()}
                                </div>
                                <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                                    <span className={`font-black truncate text-sm tracking-tight leading-none ${isAmbassador ? 'text-[var(--deep-black)]' : 'text-white'}`}>{user.fullName}</span>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        {user.fullName.toLowerCase() !== user.role.toLowerCase() && (
                                            <>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${isAmbassador ? 'text-[var(--primary-orange)]' : 'text-blue-400'}`}>{user.role}</span>
                                                <div className={`w-1 h-1 rounded-full ${isAmbassador ? 'bg-gray-300' : 'bg-slate-700'}`} />
                                            </>
                                        )}
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${isAmbassador ? 'text-emerald-700 bg-emerald-100/60 border-emerald-200' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'}`}>Verified</span>
                                    </div>
                                </div>
                            </Link>
                            <button
                                onClick={async () => { await logoutAction(); window.location.href = '/' }}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 transition-all text-[10px] font-black uppercase tracking-[0.2em] group ${isAmbassador ? 'rounded-md bg-white border border-[var(--warm-gray)] text-[var(--text-gray)] hover:text-red-600 hover:bg-red-50 shadow-sm' : 'rounded-2xl bg-white/[0.03] text-blue-200 hover:text-white hover:bg-red-500/20 border border-white/10'}`}
                            >
                                <LogOut size={14} className="text-red-500/60 group-hover:text-red-500 transition-colors" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Toggle Button */}
                {collapsed ? (
                    <button
                        onClick={toggle}
                        className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center transition-all shadow-lg z-30 ${isAmbassador ? 'bg-white border border-[var(--warm-gray)] rounded-r-md text-[var(--text-gray)] hover:text-[var(--primary-orange)] hover:bg-gray-50' : 'bg-[#1e293b] border border-white/20 rounded-r-xl text-gray-400 hover:text-amber-400 hover:bg-[#334155]'}`}
                        title="Expand sidebar"
                        aria-label="Expand sidebar"
                        aria-expanded="false"
                    >
                        <ChevronRight size={14} />
                    </button>
                ) : (
                    <button
                        onClick={toggle}
                        className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center transition-all shadow-lg z-30 ${isAmbassador ? 'bg-white border border-[var(--warm-gray)] rounded-r-md text-[var(--text-gray)] hover:text-[var(--primary-orange)] hover:bg-gray-50' : 'bg-[#1e293b] border border-white/20 rounded-r-xl text-gray-400 hover:text-amber-400 hover:bg-[#334155]'}`}
                        title="Collapse sidebar"
                        aria-label="Collapse sidebar"
                        aria-expanded="true"
                    >
                        <ChevronLeft size={14} />
                    </button>
                )}
            </aside>

            {/* Spacer that matches sidebar width */}
            <div className={`hidden xl:block transition-all duration-300 ease-in-out flex-shrink-0 ${collapsed ? 'w-[64px]' : 'w-[280px]'}`} />
        </>
    )
}
