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
    user: { fullName: string; role: string, email: string, profileImage?: string | null }
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
                className={`desktop-sidebar hidden xl:flex flex-col p-0 fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 ease-in-out border-r border-gray-200 bg-white shadow-sm ${collapsed ? 'w-[64px]' : 'w-[280px]'}`}
            >
                {/* Top decorative accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-[var(--primary-orange)] to-[var(--primary-orange-hover)]" />

                {/* Logo area */}
                <div className={`flex flex-col items-center pt-8 pb-4 transition-all duration-300 ${collapsed ? 'px-1' : 'px-4'}`}>
                    <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-500 mb-4 flex items-center justify-center">
                        <img
                            src="/images/HEGURU-JAPAN-LOGO.jpeg"
                            alt="Heguru"
                            className={`relative object-contain transition-all duration-300 ${collapsed ? 'h-[36px] w-auto' : 'h-[64px] w-auto max-w-[140px]'}`}
                        />
                    </div>
                    {!collapsed && (
                        <div className="text-center px-2">
                            <h2 className="text-[13px] font-black tracking-tight text-gray-900 leading-tight">Heguru Partnership Program</h2>
                            {!isAmbassador && (
                                <span className="inline-block mt-1.5 px-3 py-0.5 rounded-full text-[9px] font-bold text-primary-orange-hover bg-orange-50 border border-orange-100 uppercase tracking-widest">
                                    Admin Panel
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="px-4 mb-4">
                    <div className="h-px w-full bg-gray-100" />
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
                                        ${collapsed ? 'justify-center px-0 py-2.5' : 'px-4 py-2.5'}
                                        rounded-xl
                                        ${active
                                            ? 'text-primary-orange-hover bg-orange-50/70 font-extrabold border border-orange-100/50 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
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
                                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 transition-transform duration-500 bg-primary-orange-hover rounded-r-md ${active ? 'scale-y-100' : 'scale-y-0 group-hover/item:scale-y-100'}`} />
                                    )}
                                    {/* Icon */}
                                    {React.isValidElement(item.icon)
                                        ? React.cloneElement(item.icon as React.ReactElement<any>, {
                                            size: 18,
                                            className: `flex-shrink-0 transition-all duration-300 relative z-10
                                                ${active
                                                    ? 'text-primary-orange-hover scale-105'
                                                    : 'text-gray-400 group-hover/item:text-gray-700 group-hover/item:scale-105'}`
                                        })
                                        : item.icon}
                                    {/* Label */}
                                    {!collapsed && (
                                        <span className={`text-[11px] font-bold uppercase tracking-[0.05em] truncate relative z-10 transition-colors duration-200
                                            ${active 
                                                ? 'text-primary-orange-hover' 
                                                : 'text-gray-500 group-hover/item:text-gray-900'}`}>
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
                <div className={`mt-auto border-t transition-all duration-300 ${collapsed ? 'px-1 py-3' : 'px-4 py-4'} border-gray-100 bg-gray-50/50`}>
                    {collapsed ? (
                        // Collapsed footer: avatar only
                        <div className="flex flex-col items-center gap-2">
                            <Link href="/profile" className="no-underline" title={user.fullName}>
                                <div className="w-9 h-9 flex items-center justify-center text-xs font-black text-white bg-primary-orange-hover rounded-full ring-2 ring-orange-100 shadow-md overflow-hidden">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt="" className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <span>{user.fullName[0].toUpperCase()}{(user.role === 'Super Admin' ? 'A' : '')}</span>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ) : (
                        // Expanded footer
                        <div className="flex flex-col gap-3">
                            <Link href="/profile" className="flex items-center gap-3 transition-all no-underline text-inherit bg-white border border-gray-200 rounded-xl p-2.5 shadow-sm hover:bg-gray-50">
                                <div className="w-9 h-9 flex items-center justify-center text-xs font-black text-white bg-primary-orange-hover rounded-full ring-2 ring-orange-100 shadow-md flex-shrink-0 overflow-hidden">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt="" className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <span>{user.fullName === 'Super Admin' ? 'SA' : user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</span>
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                                    <span className="font-extrabold truncate text-[12px] text-gray-900 leading-none">{user.fullName}</span>
                                    <span className="text-[10px] text-gray-400 truncate mt-1 leading-none">
                                        {user.fullName === 'Super Admin' || 'Campus Admin' ||'Campus Head' || 'Admission Head' ||'Finance' ? 'superadmin@heguru.com' : `${user.email}`}
                                    </span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><path d="m6 9 6 6 6-6"/></svg>
                            </Link>
                            <button
                                onClick={async () => { await logoutAction(); window.location.href = '/' }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 transition-all text-[9px] font-black uppercase tracking-[0.2em] rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 shadow-sm"
                            >
                                <LogOut size={12} className="text-red-500" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Toggle Button */}
                {collapsed ? (
                    <button
                        onClick={toggle}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center transition-all bg-white border border-gray-200 rounded-r-md text-gray-400 hover:text-primary-orange-hover hover:bg-gray-50 shadow-md z-30"
                        title="Expand sidebar"
                        aria-label="Expand sidebar"
                        aria-expanded="false"
                    >
                        <ChevronRight size={14} />
                    </button>
                ) : (
                    <button
                        onClick={toggle}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center transition-all bg-white border border-gray-200 rounded-r-md text-gray-400 hover:text-primary-orange-hover hover:bg-gray-50 shadow-md z-30"
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
