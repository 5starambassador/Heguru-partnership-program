import { ChevronLeft, Star, Timer, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useWebOTP } from '@/hooks/useWebOTP'

interface OtpVerificationProps {
    mobile: string
    otp: string
    setOtp: (value: string) => void
    onVerify: () => void
    onBack: () => void
    onResend?: () => void
    loading: boolean
    isNewUser: boolean
    isForgotMode?: boolean
}

export const OtpVerification = ({ mobile, otp, setOtp, onVerify, onBack, onResend, loading, isNewUser, isForgotMode }: OtpVerificationProps) => {
    useWebOTP(setOtp)
    const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
    const [canResend, setCanResend] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        // Enable resend after 30 seconds
        const resendTimer = setTimeout(() => {
            setCanResend(true)
        }, 30000)

        return () => {
            clearInterval(timer)
            clearTimeout(resendTimer)
        }
    }, [])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    const handleResendClick = () => {
        if (!canResend || !onResend) return
        setCanResend(false)
        setTimeLeft(180) // Reset expiration timer on new OTP
        onResend()
        // Re-enable resend after 30s
        setTimeout(() => setCanResend(true), 30000)
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 relative">
                <button
                    onClick={onBack}
                    className="absolute top-0 left-0 w-10 h-10 rounded-full flex items-center justify-center bg-[var(--soft-gray)] border border-[var(--warm-gray)] text-[var(--deep-black)] hover:bg-[var(--warm-gray)] transition-all z-50 group shadow-md"
                >
                    <ChevronLeft className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
                </button>
                <div className="flex flex-col items-center mb-2 w-full">
                    <img
                        src="/images/HEGURU-JAPAN-LOGO.jpeg"
                        alt="Heguru Japan Logo"
                        className="h-16 w-auto mb-3 rounded-xl border border-[var(--warm-gray)] shadow-sm relative z-10"
                    />
                    <div className="flex flex-col items-center gap-2 mb-4 w-full">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--learning-blue)]/10 border border-[var(--learning-blue)]/20 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--learning-blue)] shadow-sm">
                            <Star size={10} className="text-[var(--learning-blue)] fill-[var(--learning-blue)]" />
                            <span>Heguru Partnership Program (HPP)</span>
                        </div>
                        {/* <div className="inline-flex items-center px-4 py-1 rounded-full bg-[var(--primary-orange)]/10 border border-[var(--primary-orange)]/20 text-[9px] font-black text-[var(--primary-orange)] uppercase tracking-[0.2em] shadow-sm">
                            25<sup className="text-[0.6em] ml-0.5">th</sup> <span className="ml-1.5">Year Celebration</span>
                        </div> */}
                    </div>
                </div>
                <h2 className="text-xl font-black text-[var(--deep-black)] tracking-tight font-heading">Verify Identity</h2>
                <div className="inline-block px-3 py-1 rounded-full bg-[var(--soft-gray)] border border-[var(--warm-gray)]">
                    <p className="text-[var(--deep-black)] text-xs font-mono tracking-widest">+91 {mobile}</p>
                </div>
                <p className="text-[10px] text-[var(--primary-orange)] font-bold uppercase tracking-[0.2em] mt-2">
                    {isForgotMode ? 'Password Recovery' : isNewUser ? 'New Registration' : 'Secure Login'}
                </p>
            </div>

            <div className="space-y-6">
                <div className="group relative">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em]">Enter 4-Digit Code</label>
                        <div className="flex items-center gap-1.5 text-[var(--primary-orange)]/90">
                            <Timer className="w-3 h-3" />
                            <span className="text-[10px] font-mono font-bold">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                    <input
                        type="text"
                        autoFocus
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        disabled={loading}
                        className="block w-full bg-white border border-[var(--warm-gray)] rounded-2xl px-4 h-14 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-md transition-all text-3xl font-black tracking-[0.5em] text-center"
                        placeholder="••••"
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => e.key === 'Enter' && otp.length === 4 && onVerify()}
                    />
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleResendClick}
                            disabled={!canResend || loading}
                            className={`text-[10px] font-bold uppercase tracking-[0.1em] flex items-center gap-1.5 transition-colors ${canResend ? 'text-[var(--primary-orange)] hover:text-[var(--primary-orange-hover)] cursor-pointer' : 'text-[var(--text-gray)]/40 cursor-not-allowed'}`}
                        >
                            <RefreshCw className={`w-3 h-3 ${!canResend ? 'animate-spin-slow' : ''}`} />
                            {canResend ? 'Resend OTP' : 'Resend in 30s'}
                        </button>
                    </div>
                </div>

                <button
                    className={`w-full h-12 rounded-xl bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] hover:from-[var(--primary-orange-hover)] hover:to-[#be4800] text-white font-bold tracking-[0.05em] text-sm shadow-lg shadow-[var(--primary-orange)]/10 hover:shadow-[var(--primary-orange)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group border border-transparent ${otp.length !== 4 || loading ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    onClick={onVerify}
                    disabled={loading || otp.length !== 4}
                >
                    <span className="relative z-10 flex items-center gap-2 transition-colors">
                        {loading ? 'Verifying...' : 'Verify & Proceed'}
                    </span>
                </button>
            </div>
        </div>
    )
}
