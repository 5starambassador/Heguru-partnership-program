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
    profileImage?: string | null
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
                                isActive = pathname === itemPath && currentView === itemView
                            } else {
                                isActive = pathname === itemPath && !currentView
                            }
                        } catch (e) {
                            isActive = pathname === item.href
                        }
                    }

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={isMobile
                                // Mobile: Royal Light Theme - Compact High-Contrast Grid (2 Cols)
                                ? `flex items-center gap-2.5 px-3 py-3 transition-all duration-200 group no-underline relative overflow-hidden rounded-xl border ${
                                    isActive
                                        ? isAmbassador
                                            ? 'bg-orange-50 border-orange-200 text-primary-orange-hover font-black shadow-sm'
                                            : 'bg-blue-50 border-blue-200 text-blue-700 font-black shadow-sm'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
                                }`
                                // Desktop List Item Styles (Premium Sidebar)
                                : `flex items-center gap-3 px-4 py-3.5 transition-all group relative overflow-hidden no-underline rounded-2xl ${
                                    isActive 
                                        ? isAmbassador
                                            ? 'text-[var(--primary-orange)] bg-[var(--primary-orange)]/5 font-black border border-[var(--primary-orange)]/15 shadow-sm'
                                            : 'text-primary-orange-hover bg-orange-50/70 font-black border border-orange-100/50 shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`
                            }
                        >
                            {!isMobile && (
                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 transition-transform duration-500 rounded-r-md ${isAmbassador ? 'bg-[var(--primary-orange)]' : 'bg-primary-orange-hover'} ${isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />
                            )}

                            {/* Icon */}
                            {React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<any>, {
                                size: isMobile ? 18 : 20,
                                className: `flex-shrink-0 transition-all duration-300 relative z-10 ${
                                    isActive 
                                        ? isAmbassador ? 'text-primary-orange-hover' : 'text-blue-600'
                                        : 'text-gray-400 group-hover:text-gray-700'
                                }`
                            }) : item.icon}

                            <span className={`text-[11px] font-bold uppercase tracking-wider truncate z-10 relative transition-colors ${
                                isActive 
                                    ? isAmbassador ? 'text-primary-orange-hover font-extrabold' : 'text-blue-700 font-extrabold'
                                    : 'text-gray-700 group-hover:text-gray-900'
                            }`}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            {/* Compact Footer (Profile + Logout) */}
            <div className={`mt-auto px-4 py-4 border-t border-gray-200 bg-gray-50/90 backdrop-blur-md`}>
                <div className={`flex flex-col items-stretch gap-2.5`}>
                    <Link href="/profile" className="flex items-center gap-3 transition-all no-underline text-inherit bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-2.5 shadow-sm">
                        <div
                            className={`w-[40px] h-[40px] flex items-center justify-center text-sm font-black text-white shadow-md flex-shrink-0 ring-2 ring-gray-150 rounded-full relative overflow-hidden ${
                                isAmbassador ? 'bg-gradient-to-br from-[var(--primary-orange)] to-[var(--primary-orange-hover)]' : 'bg-gradient-to-br from-blue-600 to-indigo-600'
                            }`}
                        >
                            {user.profileImage ? (
                                <img src={user.profileImage} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <span>{user.fullName[0]?.toUpperCase() || 'U'}</span>
                            )}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                            <span className="font-extrabold truncate text-xs text-gray-900 tracking-tight leading-tight">
                                {user.fullName}
                            </span>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className={`text-[9px] font-black uppercase tracking-wider leading-none ${isAmbassador ? 'text-primary-orange-hover' : 'text-blue-600'}`}>
                                    {user.role}
                                </span>
                                <div className="w-1 h-1 rounded-full bg-gray-300" />
                                <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border text-emerald-700 bg-emerald-50 border-emerald-200">
                                    Verified
                                </span>
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
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 transition-all text-[10px] font-black uppercase tracking-widest rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 shadow-sm"
                    >
                        <LogOut size={14} className="text-red-500" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
