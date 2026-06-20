'use client'

import { createPortal } from 'react-dom'
import { Bell, X, Share2, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { HyperlinkedText } from './HyperlinkedText'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Notification {
    id: number
    title: string
    message: string
    type: string
    link?: string | null
    createdAt: Date | string
}

interface NotificationDetailModalProps {
    isOpen: boolean
    onClose: () => void
    notification: Notification | null
    userName?: string
    referralCode?: string
    getIcon: (type: string) => React.ReactNode
}

export function NotificationDetailModal({
    isOpen,
    onClose,
    notification,
    userName,
    referralCode,
    getIcon
}: NotificationDetailModalProps) {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

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

    if (!mounted || !notification) return null

    const formattedTitle = (notification.title || '')
        .replace(/{userName}|{Ambassador}/g, userName || 'Ambassador')
        .replace(/{referralCode}|{code}/g, referralCode || '')

    const formattedMessage = (notification.message || '')
        .replace(/{userName}|{Ambassador}/g, userName || 'Ambassador')
        .replace(/{referralCode}|{code}/g, referralCode || '')

    const handleShare = () => {
        const text = `${formattedTitle}\n\n${formattedMessage}`
        const urlInMessage = formattedMessage.match(/(https?:\/\/[^\s]+)/)?.[0]
        const finalUrl = notification.link || urlInMessage || window.location.href

        const shareData = {
            title: formattedTitle,
            text: text,
            url: finalUrl
        }

        if (navigator.share) {
            navigator.share(shareData).catch(console.error)
        } else {
            let whatsappText = text
            if (finalUrl && !text.includes(finalUrl)) {
                whatsappText += `\n\nLink: ${finalUrl}`
            }
            window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, '_blank')
        }
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-sm bg-white border border-gray-150 rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl p-8 mb-[env(safe-area-inset-bottom)] pb-12 sm:pb-8"
                    >
                        {/* Mobile Drag Handle */}
                        <div className="sm:hidden w-12 h-1.5 bg-gray-200 rounded-full mx-auto -mt-4 mb-6" />

                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                    {getIcon(notification.type)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 leading-tight">
                                        {formattedTitle}
                                    </h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 font-heading">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleShare}
                                    className="w-10 h-10 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded-full flex items-center justify-center transition-all shadow-sm"
                                    title="Share on WhatsApp"
                                >
                                    <Share2 size={18} className="text-emerald-600" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-full flex items-center justify-center transition-all shadow-sm"
                                    aria-label="Close"
                                >
                                    <X size={18} className="text-gray-500 hover:text-gray-700" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-1 mb-8">
                            <HyperlinkedText
                                className="text-sm text-gray-600 leading-relaxed font-medium"
                                text={formattedMessage}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            {notification.link && (
                                <button
                                    onClick={() => {
                                        if (notification.link) router.push(notification.link)
                                        onClose()
                                    }}
                                    className="w-full py-4 rounded-2xl bg-ui-primary hover:bg-primary-orange-hover text-white font-black uppercase tracking-widest shadow-lg shadow-ui-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-heading"
                                >
                                    View Details
                                    <ChevronLeft size={16} className="rotate-180" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    )
}
