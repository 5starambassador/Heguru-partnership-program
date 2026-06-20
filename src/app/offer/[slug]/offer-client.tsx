'use client'

import { useState } from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShieldCheck, Star, ExternalLink, Smartphone, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { captureProgramLead } from '@/app/program-actions'

export function OfferClient({ programTitle }: { programTitle: string }) {
    const params = useParams()
    const searchParams = useSearchParams()

    // Get Slug & Ref Code
    const slug = params.slug as string
    const refCode = searchParams.get('ref')

    const [mobile, setMobile] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    const handleProceed = async () => {
        if (!mobile || mobile.length < 10) {
            toast.error('Please enter a valid 10-digit mobile number')
            return
        }
        if (!refCode) {
            toast.error('Invalid Referral Link. Please ask your ambassador for a new link.')
            return
        }

        setLoading(true)
        const res = await captureProgramLead({
            slug,
            referralCode: refCode,
            visitorMobile: mobile,
            visitorName: name
        })

        if (res.success && res.targetUrl) {
            toast.success('Redirecting to Special Offer...')
            window.location.href = res.targetUrl
        } else {
            setLoading(false)
            toast.error(res.error || 'Offer invalid or expired')
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900 font-[family-name:var(--font-outfit)] flex flex-col relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--primary-orange)]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-[var(--learning-blue)]/5 rounded-full blur-[120px]" />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="w-full max-w-md"
                >
                    {/* Ambassador Badge */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-55/60 border border-amber-250 mb-4 shadow-sm">
                            <Star size={14} className="text-amber-500 fill-amber-500" />
                            <span className="text-[11px] font-black text-amber-800 uppercase tracking-widest">VIP Invitation</span>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Claim Your Special Offer</h1>
                        <p className="text-gray-500 text-sm">You have been invited by your friend to access: <br /><span className="text-[var(--primary-orange)] font-black">{programTitle}</span></p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white border border-gray-250/80 rounded-[32px] p-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary-orange)] to-amber-500" />

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Your Mobile Number</label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-[var(--primary-orange)]/5 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative flex items-center bg-gray-50 border border-gray-250/70 rounded-2xl h-14 px-4 transition-all group-focus-within:bg-white group-focus-within:border-[var(--primary-orange)]/50 group-focus-within:ring-2 group-focus-within:ring-[var(--primary-orange)]/10">
                                        <Smartphone className="text-gray-400 mr-3" size={20} />
                                        <input
                                            type="tel"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            placeholder="98765 43210"
                                            className="w-full h-full bg-transparent border-none outline-none text-lg font-bold text-gray-900 placeholder-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Your Name</label>
                                <div className="relative flex items-center bg-gray-50 border border-gray-250/70 rounded-2xl h-14 px-4 transition-all focus-within:bg-white focus-within:border-[var(--primary-orange)]/50 focus-within:ring-2 focus-within:ring-[var(--primary-orange)]/10">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full h-full bg-transparent border-none outline-none text-sm font-medium text-gray-900 placeholder-gray-300"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleProceed}
                                disabled={loading}
                                className="w-full h-16 rounded-2xl bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-[var(--primary-orange)]/25 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[var(--primary-orange)]/35 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Proceed to Offer <ChevronRight size={18} strokeWidth={3} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-gray-400 flex items-center justify-center gap-2">
                        <ShieldCheck size={12} className="text-[var(--primary-orange)]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Secure Redirect • Official Heguru URL</span>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
