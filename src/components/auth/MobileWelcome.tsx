'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'

interface MobileWelcomeProps {
    onGetStarted: () => void
}

export function MobileWelcome({ onGetStarted }: MobileWelcomeProps) {
    return (
        <div className="flex flex-col h-full relative overflow-hidden bg-white rounded-3xl">
            {/* Background Effects - Simplified light style for mobile container */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-orange)]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--learning-blue)]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            <div className="flex-1 flex flex-col px-6 pt-8 pb-6 z-10 items-center text-center">
                {/* Logo & Badge Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center space-y-4 mb-6 w-full"
                >
                    <img
                        src="/images/HEGURU-JAPAN-LOGO.jpeg"
                        alt="Heguru Japan Logo"
                        className="w-24 h-auto rounded-xl shadow-sm border border-[var(--warm-gray)]"
                    />

                    <div className="flex flex-col items-center">
                        <div className="flex flex-row items-center gap-1.5">
                            <h2 className="text-[var(--deep-black)] text-lg font-black tracking-tight uppercase leading-none font-heading">
                                Heguru
                            </h2>
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[var(--primary-orange)] text-white uppercase tracking-wider">
                                Japan
                            </span>
                        </div>
                        <p className="text-[10px] text-[var(--text-gray)] font-bold uppercase tracking-widest text-center mt-1">
                            Partnership Program
                        </p>
                        <p className="text-[var(--primary-orange)] text-[9px] font-black uppercase tracking-[0.2em] mt-1.5 text-center flex items-center gap-1">
                            <Star size={8} className="fill-[var(--primary-orange)]" />
                            <span>25th Year Celebration</span>
                        </p>
                    </div>
                </motion.div>

                {/* Main Typography */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-8 space-y-4"
                >
                    <h1 className="text-5xl font-black tracking-tighter leading-[0.9] text-[var(--deep-black)] font-heading">
                        <span className="text-[var(--primary-orange)]">25</span> Years of
                        <br />
                        Excellence
                    </h1>

                    <p className="text-[var(--text-gray)] text-sm leading-relaxed max-w-[280px] mx-auto font-medium">
                        Join an elite community of partners committed to shaping and securing the future of education by empowering minds and enriching lives.
                    </p>
                </motion.div>

                {/* Main Action */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="w-full mt-auto"
                >
                    <button
                        onClick={onGetStarted}
                        className="w-full bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] hover:from-[var(--primary-orange-hover)] hover:to-[#be4800] text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-[var(--primary-orange)]/10 flex items-center justify-center transition-all active:scale-95 hover:scale-[1.02]"
                    >
                        Get Started <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </motion.div>
            </div>

            <div className="p-4 flex justify-center gap-4 text-[9px] uppercase tracking-widest text-[var(--text-gray)]/50 font-bold relative z-10 border-t border-[var(--soft-gray)] bg-white rounded-b-3xl">
                <a href="/policies/terms" className="hover:text-[var(--primary-orange)] transition-colors">Terms</a>
                <span>•</span>
                <a href="/policies/refund" className="hover:text-[var(--primary-orange)] transition-colors">Refunds</a>
                <span>•</span>
                <a href="/policies/contact" className="hover:text-[var(--primary-orange)] transition-colors">Contact</a>
            </div>
        </div>
    )
}
