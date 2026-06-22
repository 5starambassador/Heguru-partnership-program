'use client'

import { BrandSidebar } from './BrandSidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export const AuthLayout = ({ children, animationKey }: { children: React.ReactNode, animationKey?: string | number }) => {
    return (
        <main className="fixed inset-0 w-full h-full flex bg-gradient-to-br from-[#fffdfa] via-[#fbfbfb] to-[#f5f7fa] overflow-hidden z-40">
            {/* Unified Shared Background for Mobile/Desktop seamlessness */}
            <div className="absolute inset-0 bg-[url('/bg-pattern.webp')] bg-cover opacity-[0.03] z-0 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary-orange)]/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--learning-blue)]/5 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 z-0 pointer-events-none"></div>

            {/* Animated 3D Sparks / Glowing Orbs in the background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* 3D Orb 1 (Orange Spark) */}
                <motion.div
                    className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 via-[var(--primary-orange)] to-red-500 shadow-[0_0_50px_rgba(242,110,33,0.3),inset_-8px_-8px_20px_rgba(0,0,0,0.15),inset_8px_8px_20px_rgba(255,255,255,0.6)] opacity-60"
                    style={{ top: '15%', right: '10%' }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, 15, 0],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* 3D Orb 2 (Blue Spark) */}
                <motion.div
                    className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-sky-300 via-[var(--learning-blue)] to-indigo-600 shadow-[0_0_40px_rgba(59,130,246,0.25),inset_-6px_-6px_15px_rgba(0,0,0,0.15),inset_6px_6px_15px_rgba(255,255,255,0.6)] opacity-50"
                    style={{ bottom: '20%', right: '35%' }}
                    animate={{
                        y: [0, 40, 0],
                        x: [0, -20, 0],
                        scale: [1, 0.95, 1]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Sparkle 1 */}
                {/* <motion.div
                    className="absolute text-[var(--primary-orange)]/30"
                    style={{ top: '30%', left: '60%' }}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.7, 0.3],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Sparkles size={24} />
                </motion.div> */}

                {/* Sparkle 2 */}
                <motion.div
                    className="absolute text-[var(--learning-blue)]/20"
                    style={{ bottom: '40%', left: '70%' }}
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.6, 0.2],
                        rotate: [360, 180, 0]
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Sparkles size={20} />
                </motion.div>
            </div>

            {/* Left Pane - Brand Experience (Desktop Only) */}
            <BrandSidebar />

            {/* Right Pane - Action Center */}
            <div className="w-full lg:w-1/2 flex flex-col items-center p-4 sm:p-6 lg:p-12 relative h-full overflow-y-auto z-10">

                {/* Glass Container */}
                <div className="relative z-10 w-full max-w-md sm:max-w-lg flex flex-col my-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={animationKey}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-full bg-white p-8 py-10 sm:py-12 rounded-3xl border border-gray-300 shadow-4xl shadow-gray-600/50 min-h-[450px] sm:min-h-[500px] flex flex-col justify-center relative overflow-hidden"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="relative z-10 pb-6 text-center space-y-2">
                    <p className="text-[11px] font-medium tracking-[0.3em] text-[var(--text-gray)]/60 uppercase cursor-default">
                        © 2026 Heguru Educational Public Trust
                    </p>
                    <div className="flex justify-center gap-4 text-[11px] font-medium text-[var(--text-gray)]/40 uppercase tracking-widest">
                        <a href="/policies/terms" className="hover:text-[var(--primary-orange)] transition-colors">Terms</a>
                        <a href="/policies/refund" className="hover:text-[var(--primary-orange)] transition-colors">Refunds</a>
                        <a href="/policies/contact" className="hover:text-[var(--primary-orange)] transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        </main>
    )
}
