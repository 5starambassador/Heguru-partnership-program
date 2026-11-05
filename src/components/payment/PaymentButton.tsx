'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { simulatePayment } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface PaymentButtonProps {
    amount: number
    onSuccess?: () => void
    customerPhone?: string
    userId?: number
}

export default function PaymentButton({ amount, onSuccess, userId }: PaymentButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handlePayment = async () => {
        if (!userId) {
            toast.error("User session not loaded. Please wait or log in again.")
            return
        }
        setLoading(true)
        toast.info("Simulating payment...")
        try {
            const res = await simulatePayment(userId)
            if (res.success) {
                toast.success("Payment Simulated! Redirecting...")
                if (onSuccess) {
                    onSuccess()
                } else {
                    router.push('/dashboard')
                }
            } else {
                toast.error(res.error || "Simulation failed")
            }
        } catch (e: any) {
            console.error("Error simulating:", e)
            toast.error("Error simulating: " + (e.message || e))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-3">
            <button
                onClick={handlePayment}
                disabled={loading || !userId}
                className={`w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold tracking-[0.05em] text-sm shadow-lg shadow-emerald-900/40 hover:shadow-emerald-900/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/10 ${
                    (loading || !userId) ? 'opacity-50 cursor-not-allowed grayscale' : ''
                }`}
            >
                {loading ? 'Processing...' : !userId ? 'Initializing...' : `Pay ₹${amount} Now (Simulated)`}
            </button>

            <div className="pt-2">
                <p className="text-white/40 text-[10px] font-medium tracking-wide text-center uppercase">
                    Secured by Dev Simulated Gateway
                </p>
            </div>
        </div>
    )
}
