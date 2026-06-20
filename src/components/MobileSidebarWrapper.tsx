'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { createPortal } from 'react-dom'

// Context for sidebar state
interface SidebarContextType {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    viewMode: 'mobile-grid' | 'desktop-list'
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
    return useContext(SidebarContext)
}

export default function MobileSidebarWrapper({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Close sidebar on route change (including search params)
    useEffect(() => {
        setIsOpen(false)
    }, [pathname, searchParams])

    // Handle mounting and cleanup
    useEffect(() => {
        setMounted(true)
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false)
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [])

    return (
        <SidebarContext.Provider value={{ isOpen, setIsOpen, viewMode: 'mobile-grid' }}>
            {/* Hamburger Button (Mobile Only) */}
            <button
                onClick={() => setIsOpen(true)}
                className="xl:hidden p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                aria-label="Open Menu"
            >
                <Menu size={24} />
            </button>

            {/* Portal to Body */}
            {mounted && isOpen && createPortal(
                <div className="fixed inset-0 xl:hidden z-[99999]">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Top Dropdown Drawer - Clean Glass Light/Dark Theme */}
                    <div
                        className="fixed top-2 left-2 right-2 bg-white shadow-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl border border-gray-200 z-[100000]"
                    >
                        {/* Top decorative accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-[100001]" />

                        {/* decorative glows */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--primary-orange)]/5 blur-[50px] rounded-full pointer-events-none" />

                        {/* Header with Close Button & Branding */}
                        <div className="relative border-b border-gray-150 bg-white/80 backdrop-blur-xl z-10 pb-3">
                            <div className="flex justify-end p-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                    aria-label="Close Mobile Menu"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex items-center justify-start gap-3 px-5">
                                <div className="relative group shrink-0 flex items-center justify-center">
                                    <img
                                        src="/images/logo-rectangle.png"
                                        alt="Heguru Japan Logo"
                                        className="relative object-contain h-16 w-auto"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Content Area - Flex-1 to fill remaining space */}
                        <div className="flex-1 min-h-0 relative z-10 overflow-y-auto custom-scrollbar">
                            {children}
                        </div>

                    </div>
                </div>,
                document.body
            )}
        </SidebarContext.Provider >
    )
}
