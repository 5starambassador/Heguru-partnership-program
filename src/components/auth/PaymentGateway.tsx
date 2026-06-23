'use client'

import { ChevronLeft, Star } from 'lucide-react'
import PaymentButton from '@/components/payment/PaymentButton'

interface PaymentGatewayProps {
    onBack: () => void
    loading: boolean
    userId?: number
}

// Removing unused props: transactionId, setTransactionId, onComplete
export const PaymentGateway = ({ onBack, loading, userId }: PaymentGatewayProps) => {
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 relative">
                <button
                    onClick={onBack}
                    className="absolute top-0 left-0 w-10 h-10 rounded-full flex items-center justify-center bg-[var(--soft-gray)] border border-[var(--warm-gray)] text-[var(--deep-black)] hover:bg-[var(--warm-gray)] transition-all z-50 group shadow-md"
                >
                    <ChevronLeft className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
                </button>
                <div className="flex flex-col items-center gap-2 mb-4 w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--learning-blue)]/10 border border-[var(--learning-blue)]/20 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--learning-blue)] shadow-sm">
                        <Star size={10} className="text-[var(--learning-blue)] fill-[var(--learning-blue)]" />
                        <span>Heguru Partnership Program (HPP)</span>
                    </div>
                    {/* <div className="inline-flex items-center px-4 py-1 rounded-full bg-[var(--primary-orange)]/10 border border-[var(--primary-orange)]/20 text-[9px] font-black text-[var(--primary-orange)] uppercase tracking-[0.2em] shadow-sm">
                        25<sup className="text-[0.6em] ml-0.5">th</sup> <span className="ml-1.5">Year Celebration</span>
                    </div> */}
                </div>
                <h2 className="text-xl font-black text-[var(--deep-black)] tracking-tight font-heading">Secure Payment</h2>
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">Final Step</p>
                </div>
            </div>

            <div className="bg-[var(--soft-gray)] p-6 sm:p-8 rounded-[32px] text-center border border-[var(--warm-gray)] shadow-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-orange)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative z-10">
                    <p className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-wider mb-8">Pay Membership Fee</p>

                    <PaymentButton amount={25} userId={userId} />
                </div>
            </div>

            <div className="flex justify-center gap-4 text-[9px] uppercase tracking-widest text-[var(--text-gray)]/50 font-bold mt-4 pt-4 border-t border-[var(--warm-gray)]">
                <a href="/policies/terms" target="_blank" className="hover:text-[var(--primary-orange)] transition-colors">Terms</a>
                <span className="text-[var(--warm-gray)]">•</span>
                <a href="/policies/refund" target="_blank" className="hover:text-[var(--primary-orange)] transition-colors">Refunds</a>
                <span className="text-[var(--warm-gray)]">•</span>
                <a href="/policies/contact" target="_blank" className="hover:text-[var(--primary-orange)] transition-colors">Contact</a>
            </div>
        </div>
    )
}
