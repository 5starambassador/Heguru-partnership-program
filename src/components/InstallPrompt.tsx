'use client'

import { useState, useEffect } from 'react'
import { X, Download, Smartphone, Zap, Lock, Wifi } from 'lucide-react'
import { Capacitor } from '@capacitor/core'

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android')
    const [detectedIOS, setDetectedIOS] = useState(false)

    const handleInstallClick = async () => {
        if (!deferredPrompt) return
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') setShowPrompt(false)
        setDeferredPrompt(null)
    }

    useEffect(() => {
        if (Capacitor.isNativePlatform()) return
        const userAgent = window.navigator.userAgent.toLowerCase()
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent)
        setDetectedIOS(isIosDevice)
        setActiveTab(isIosDevice ? 'ios' : 'android')

        const isStandalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches
        if (isStandalone) return

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault()
            setDeferredPrompt(e)
            if (!localStorage.getItem('installPromptDismissedAt')) {
                setShowPrompt(true)
            }
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        if (isIosDevice && !isStandalone && !localStorage.getItem('installPromptDismissedAt')) {
            const timer = setTimeout(() => setShowPrompt(true), 3000)
            return () => clearTimeout(timer)
        }

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }, [])

    useEffect(() => {
        const handleTriggerInstall = () => {
            setShowPrompt(true)
            // Force correct tab on manual trigger if detected
            if (detectedIOS) setActiveTab('ios')
        }
        window.addEventListener('trigger-PWA-install', handleTriggerInstall)
        return () => window.removeEventListener('trigger-PWA-install', handleTriggerInstall)
    }, [detectedIOS])

    const handleDismiss = () => {
        setShowPrompt(false)
        localStorage.setItem('installPromptDismissedAt', Date.now().toString())
    }

    if (!showPrompt) return null

    return (
        <div className="fixed top-20 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[200] animate-in slide-in-from-top duration-500">
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_20px_50px_rgba(17,17,17,0.15)] border border-slate-200/80 p-6 text-slate-800 relative overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--primary-orange)]/10 blur-[80px] rounded-full" />

                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors z-50"
                >
                    <X size={18} />
                </button>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary-orange)] to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
                            <Smartphone size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight text-slate-900">Install Official App</h3>
                            <p className="text-[10px] uppercase tracking-widest text-[var(--primary-orange)] font-bold">Fast • Offline • Secure</p>
                        </div>
                    </div>

                    {/* Platform Selector Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200/50">
                        <button
                            onClick={() => setActiveTab('android')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'android' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/30' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            ANDROID
                        </button>
                        <button
                            onClick={() => setActiveTab('ios')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'ios' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/30' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            APPLE (iOS)
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="min-h-[140px] animate-in fade-in transition-all duration-300">
                        {activeTab === 'android' ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 border-l-4 border-l-blue-500">
                                    <p className="text-sm font-semibold leading-relaxed text-slate-700">
                                        Tap the <span className="text-slate-950 font-black">three dots (⋮)</span> in Chrome and select <span className="text-[var(--primary-orange)] font-black">"Install App"</span> or <span className="text-[var(--primary-orange)] font-black">"Add to Home Screen"</span>.
                                    </p>
                                </div>
                                {deferredPrompt && (
                                    <button
                                        onClick={handleInstallClick}
                                        className="w-full bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                                    >
                                        <Download size={20} />
                                        ONE-TAP INSTALL
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 border-l-4 border-l-[var(--primary-orange)]">
                                    <p className="text-sm font-semibold leading-relaxed text-slate-700">
                                        1. Tap the <span className="text-slate-950 font-black">Share button</span> (square icon with arrow <span className="inline-block p-1 bg-slate-200/60 rounded ml-1 text-slate-800">↑</span>) at the bottom.
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 border-l-4 border-l-[var(--primary-orange)]">
                                    <p className="text-sm font-semibold leading-relaxed text-slate-700">
                                        2. Scroll down and tap <span className="text-[var(--primary-orange)] font-black">"Add to Home Screen"</span>.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Features Footer */}
                    <div className="mt-6 pt-5 border-t border-slate-200/60 grid grid-cols-3 gap-2">
                        <div className="text-center flex items-center justify-center gap-1.5 text-slate-400">
                            <Wifi size={12} className="text-blue-500" />
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Offline</p>
                        </div>
                        <div className="text-center flex items-center justify-center gap-1.5 text-slate-400">
                            <Lock size={12} className="text-green-500" />
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Secure</p>
                        </div>
                        <div className="text-center flex items-center justify-center gap-1.5 text-slate-400">
                            <Zap size={12} className="text-amber-500" />
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Fast</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
