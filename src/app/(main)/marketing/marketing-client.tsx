'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Download, Share2, Copy, Check, FileImage, FileText, PlayCircle, ExternalLink, Megaphone, FolderClosed, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { PageAnimate, PageItem } from '@/components/PageAnimate'
import { encryptReferralCode } from '@/lib/crypto'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://5starambassador.com'

interface Asset {
    id: number
    title: string
    description: string
    type: 'IMAGE' | 'VIDEO' | 'PDF' | 'LINK'
    url: string
    thumbnailUrl?: string
    category: string
    tags?: string[]
}

interface MarketingClientProps {
    grouped: Record<string, Asset[]>
    categories: string[]
    referralCode?: string
}

export function MarketingClient({ grouped, categories, referralCode }: MarketingClientProps) {
    const [activeCategory, setActiveCategory] = useState<string>(categories[0] || 'All')
    const [searchQuery, setSearchQuery] = useState('')
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const encryptedCode = referralCode ? encryptReferralCode(referralCode) : ''
    const referralLink = encryptedCode ? `${APP_URL}/r/${encryptedCode}` : ''

    const allAssets = Object.values(grouped).flat()

    const filteredAssets = activeCategory === 'All'
        ? allAssets
        : grouped[activeCategory] || []

    const displayAssets = filteredAssets.filter(asset =>
        asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCopyAssetLink = (asset: Asset) => {
        const textToCopy = `${asset.title}\n\n${asset.description}\n\nAsset: ${asset.url}\n\n${referralCode ? `Join me at Heguru: ${referralLink}` : ''}`
        navigator.clipboard.writeText(textToCopy)
        setCopiedUrl(asset.url)
        toast.success('Asset details & invite copied!')
        setTimeout(() => setCopiedUrl(null), 2000)
    }

    const handleShare = async (asset: Asset) => {
        const shareData = {
            title: asset.title,
            text: `${asset.description}\n\nJoin me at Heguru: ${referralLink}`,
            url: asset.url
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    navigator.clipboard.writeText(shareData.url)
                    toast.success('Link copied!')
                }
            }
        } else {
            navigator.clipboard.writeText(shareData.url)
            toast.success('Link copied!')
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'IMAGE': return <FileImage size={16} className="text-purple-500" />
            case 'VIDEO': return <PlayCircle size={16} className="text-rose-500" />
            case 'PDF': return <FileText size={16} className="text-amber-500" />
            case 'LINK': return <ExternalLink size={16} className="text-blue-500" />
            default: return <FileText size={16} className="text-slate-500" />
        }
    }

    if (!mounted) return null

    return (
        <div className="relative w-full font-[family-name:var(--font-outfit)]">

            <PageAnimate className="max-w-4xl mx-auto flex flex-col gap-8 pb-32 relative z-10">

                <PageItem className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-slate-100 hover:border-gray-300 transition-colors shadow-sm shrink-0">
                            <ChevronLeft size={20} className="text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--deep-black)] uppercase italic font-heading">
                                PROMO KIT
                            </h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
                                Official marketing infrastructure & social transmission tools.
                            </p>
                        </div>
                    </div>

                    {/* Compact Search Bar */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            className="w-full pl-11 pr-4 h-11 bg-white border border-gray-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-[var(--primary-orange)] outline-none transition-all shadow-sm text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </PageItem>

                {/* 2. CATEGORY CHIPS - POLISHED */}
                <PageItem className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveCategory('All')}
                        className={`h-9 px-5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${activeCategory === 'All'
                            ? 'bg-[var(--primary-orange)] text-white border-[var(--primary-orange)] shadow-sm'
                            : 'bg-white text-slate-600 border-gray-300 hover:bg-slate-50 hover:text-slate-800'
                            }`}
                    >
                        All Transmissions
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`h-9 px-5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${activeCategory === cat
                                ? 'bg-[var(--primary-orange)] text-white border-[var(--primary-orange)] shadow-sm'
                                : 'bg-white text-slate-600 border-gray-300 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </PageItem>

                {/* 3. LINK TRANSMISSION HUB - HIGH DENSITY LIST */}
                <div className="flex flex-col gap-3">
                    <AnimatePresence mode="popLayout">
                        {displayAssets.length > 0 ? (
                            displayAssets.map((asset) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    key={asset.id}
                                    className="group relative flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-white hover:bg-slate-50/50 border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-300 shadow-sm overflow-hidden"
                                >
                                    {/* Subtle Top Accent line */}
                                    <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/20 to-transparent opacity-40" />

                                    {/* Icon Zone */}
                                    <div className="shrink-0 w-12 h-12 bg-slate-50 border border-gray-200 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm relative overflow-hidden text-slate-600">
                                        {asset.type === 'IMAGE' ? <FileImage size={20} className="text-purple-600" /> :
                                            asset.type === 'VIDEO' ? <PlayCircle size={20} className="text-rose-600" /> :
                                                asset.type === 'PDF' ? <FileText size={20} className="text-amber-600" /> :
                                                    <ExternalLink size={20} className="text-blue-600" />}
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h3 className="font-bold text-slate-800 text-base tracking-tight truncate group-hover:text-[var(--primary-orange)] transition-colors uppercase italic leading-none font-heading">
                                                    {asset.title}
                                                </h3>
                                                <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-gray-200 text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">
                                                    {asset.category}
                                                </span>
                                            </div>
                                            <p className="text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide truncate">
                                                {asset.description}
                                            </p>
                                        </div>

                                        {/* Action Zone */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => handleShare(asset)}
                                                className="flex-1 sm:flex-none h-10 px-5 bg-gradient-to-br from-[var(--primary-orange)] to-orange-600 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap font-heading"
                                            >
                                                <Share2 size={14} strokeWidth={2.5} />
                                                <span>Share Link</span>
                                            </button>

                                            <button
                                                onClick={() => window.open(asset.url, '_blank')}
                                                className="h-10 w-10 shrink-0 bg-white hover:bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-sm border border-gray-200"
                                                title="Open Link"
                                            >
                                                <ExternalLink size={16} strokeWidth={2.5} />
                                            </button>

                                            <button
                                                onClick={() => handleCopyAssetLink(asset)}
                                                className="h-10 w-10 shrink-0 bg-white hover:bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center relative transition-all active:scale-90 shadow-sm border border-gray-200"
                                                title="Copy Details"
                                            >
                                                {copiedUrl === asset.url ? <Check size={16} strokeWidth={2.5} className="text-emerald-600" /> : <Copy size={16} strokeWidth={2.5} />}
                                                {copiedUrl === asset.url && (
                                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-emerald-500 text-white text-[8px] font-black rounded uppercase tracking-tighter shadow-md">DONE</span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-20 text-center bg-white border border-dashed border-gray-300 rounded-xl shadow-sm">
                                <FolderClosed size={40} className="text-slate-300 mx-auto mb-4" />
                                <h3 className="text-slate-800 font-black text-lg mb-1 uppercase tracking-tight font-heading">Transmission Empty</h3>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Adjust filters to find assets.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </PageAnimate>
        </div>
    )
}

