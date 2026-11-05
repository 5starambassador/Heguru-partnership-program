'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { 
    Home, UserPlus, List, User, IndianRupee, Users, 
    GraduationCap, CheckCircle, Wallet, GitFork, FileDown, ShieldCheck
} from 'lucide-react'

export function BottomNav({ role = '' }: { role?: string }) {
    const pathname = usePathname() || ''
    const searchParams = useSearchParams()

    const isSuperAdmin = role === 'Super Admin'
    const isCampusLevel = role === 'Campus Head' || role === 'Campus Admin'
    const isFinanceAdmin = role === 'Finance Admin'
    const isRegularAdmin = role.includes('Admin') && !isSuperAdmin && !isCampusLevel && !isFinanceAdmin
    const isAmbassador = role === 'Staff' || role === 'Parent' || role === 'Alumni' || role === 'Others'

    const isPathActive = (href: string) => {
        try {
            const itemUrl = new URL(href, 'http://dummy.com')
            const itemPath = itemUrl.pathname
            const itemView = itemUrl.searchParams.get('view')
            const currentView = searchParams?.get('view')

            if (itemView) {
                return pathname === itemPath && currentView === itemView
            }
            if (href === '/superadmin' || href === '/campus' || href === '/admin' || href === '/finance' || href === '/dashboard') {
                return (pathname === href || (pathname === '/' && href === '/dashboard')) && !currentView
            }
            return pathname.startsWith(itemPath)
        } catch {
            return pathname === href
        }
    }

    // Role-tailored navigation items
    let navConfig = {
        item1: { label: 'Home', href: '/dashboard', icon: Home },
        item2: { label: 'Earnings', href: '/earnings', icon: IndianRupee },
        center: { label: 'Refer', href: '/refer', icon: UserPlus, isFloating: true },
        item3: { label: 'Referrals', href: '/referrals', icon: List },
        item4: { label: 'Profile', href: '/profile', icon: User }
    }

    if (isSuperAdmin) {
        navConfig = {
            item1: { label: 'Home', href: '/superadmin', icon: Home },
            item2: { label: 'Users', href: '/superadmin/users', icon: Users },
            center: { label: 'Students', href: '/superadmin/students', icon: GraduationCap, isFloating: true },
            item3: { label: 'Approvals', href: '/superadmin/approvals', icon: CheckCircle },
            item4: { label: 'Profile', href: '/profile', icon: User }
        }
    } else if (isCampusLevel) {
        navConfig = {
            item1: { label: 'Home', href: '/campus', icon: Home },
            item2: { label: 'Users', href: '/campus/users', icon: Users },
            center: { label: 'Students', href: '/campus/students', icon: GraduationCap, isFloating: true },
            item3: { label: 'Finance', href: '/campus?view=finance', icon: IndianRupee },
            item4: { label: 'Profile', href: '/profile', icon: User }
        }
    } else if (isFinanceAdmin) {
        navConfig = {
            item1: { label: 'Home', href: '/finance', icon: Home },
            item2: { label: 'Approvals', href: '/superadmin/approvals', icon: CheckCircle },
            center: { label: 'Payouts', href: '/superadmin?view=settlements', icon: Wallet, isFloating: true },
            item3: { label: 'Verify', href: '/superadmin/verification', icon: ShieldCheck },
            item4: { label: 'Profile', href: '/profile', icon: User }
        }
    } else if (isRegularAdmin) {
        navConfig = {
            item1: { label: 'Home', href: '/admin', icon: Home },
            item2: { label: 'Students', href: '/admin?view=students', icon: GraduationCap },
            center: { label: 'Leads', href: '/admin?view=referrals', icon: GitFork, isFloating: true },
            item3: { label: 'Reports', href: '/admin?view=reports', icon: FileDown },
            item4: { label: 'Profile', href: '/profile', icon: User }
        }
    }

    const { item1, item2, center, item3, item4 } = navConfig

    const renderStandardTab = (item: { label: string; href: string; icon: any }) => {
        const active = isPathActive(item.href)
        const IconComponent = item.icon

        return (
            <Link
                href={item.href}
                className={`group flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 no-underline ${
                    active ? (isAmbassador ? 'text-primary-orange-hover' : 'text-blue-600') : 'text-gray-500 hover:text-gray-900'
                }`}
            >
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                    active 
                        ? (isAmbassador ? 'bg-orange-50 text-primary-orange-hover' : 'bg-blue-50 text-blue-600') 
                        : 'group-hover:bg-gray-100/80 text-gray-400 group-hover:text-gray-700'
                }`}>
                    <IconComponent size={20} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] uppercase tracking-wider mt-0.5 leading-none font-bold ${
                    active ? (isAmbassador ? 'text-primary-orange-hover font-black' : 'text-blue-600 font-black') : 'text-gray-500'
                }`}>
                    {item.label}
                </span>
            </Link>
        )
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 xl:hidden">
            {/* Main Bar */}
            <div className="pb-[env(safe-area-inset-bottom)] backdrop-blur-xl bg-white/95 border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                <div className="flex justify-between items-center h-16 px-2 sm:px-4 max-w-lg mx-auto">
                    {renderStandardTab(item1)}
                    {renderStandardTab(item2)}

                    {/* Center Action Button */}
                    <div className="relative -top-4 flex flex-col items-center px-1">
                        <Link
                            href={center.href}
                            className={`flex items-center justify-center transition-all duration-200 relative group shadow-lg border-2 border-white hover:scale-105 active:scale-95 w-13 h-13 rounded-2xl ${
                                isPathActive(center.href)
                                    ? isAmbassador
                                        ? 'bg-gradient-to-br from-[var(--primary-orange)] to-[var(--primary-orange-hover)] ring-2 ring-orange-200'
                                        : 'bg-gradient-to-br from-blue-600 to-indigo-600 ring-2 ring-blue-200'
                                    : isAmbassador
                                        ? 'bg-gradient-to-br from-[var(--primary-orange)] to-[var(--primary-orange-hover)]'
                                        : 'bg-gradient-to-br from-blue-600 to-indigo-600'
                            }`}
                        >
                            <center.icon size={22} className="text-white relative z-10" strokeWidth={2.5} />
                        </Link>
                        <span className={`text-[9px] font-black uppercase tracking-wider mt-1 text-center leading-none ${
                            isPathActive(center.href)
                                ? isAmbassador ? 'text-primary-orange-hover' : 'text-blue-600'
                                : 'text-gray-500'
                        }`}>
                            {center.label}
                        </span>
                    </div>

                    {renderStandardTab(item3)}
                    {renderStandardTab(item4)}
                </div>
            </div>
        </div>
    )
}
