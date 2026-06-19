'use client'

import { useState } from 'react'
import { Eye, EyeOff, ChevronLeft, Star, ArrowLeft } from 'lucide-react'

interface PasswordChallengeProps {
    mobile: string
    onLogin: (password: string) => void
    onBack: () => void
    onForgotPassword: () => void
    loading: boolean
}

export const PasswordChallenge = ({ mobile, onLogin, onBack, onForgotPassword, loading }: PasswordChallengeProps) => {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 relative">
                <button
                    onClick={onBack}
                    className="absolute top-0 left-0 w-10 h-10 rounded-full flex items-center justify-center bg-[var(--soft-gray)] border border-[var(--warm-gray)] text-[var(--deep-black)] hover:bg-[var(--warm-gray)] transition-all z-50 group shadow-md"
                >
                    <ArrowLeft className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
                </button>
                <div className="flex flex-col items-center mb-2 w-full">
                    <img
                        src="/images/HEGURU-JAPAN-LOGO.jpeg"
                        alt="Heguru Japan Logo"
                        className="h-24 w-auto mb-3 rounded-md shadow-lg border border-[var(--warm-gray)] shadow-sm relative z-10"
                    />
                    {/* <div className="flex flex-col items-center gap-2 mb-4 w-full">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--learning-blue)]/10 border border-[var(--learning-blue)]/20 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--learning-blue)] shadow-sm">
                            <Star size={10} className="text-[var(--learning-blue)] fill-[var(--learning-blue)]" />
                            <span>Heguru Partnership Program (HPP)</span>
                        </div>
                        <div className="inline-flex items-center px-4 py-1 rounded-full bg-[var(--primary-orange)]/10 border border-[var(--primary-orange)]/20 text-[9px] font-black text-[var(--primary-orange)] uppercase tracking-[0.2em] shadow-sm">
                            25<sup className="text-[0.6em] ml-0.5">th</sup> <span className="ml-1.5">Year Celebration</span>
                        </div>
                    </div> */}
                </div>
                <h2 className="text-3xl font-black text-[var(--deep-black)] tracking-tight font-heading">Welcome Back</h2>
                <div className="inline-block px-3 py-1 rounded-full bg-[var(--soft-gray)] border border-[var(--warm-gray)]">
                    <p className="text-[var(--deep-black)] text-xs font-mono tracking-widest">+91 {mobile}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Password</label>
                    <div className="relative group">
                        <input
                            type={showPassword ? "text" : "password"}
                            autoFocus
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            className="block w-full bg-white border border-[var(--warm-gray)] rounded-2xl pl-6 pr-12 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-md transition-all text-lg font-medium tracking-wide"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && password && onLogin(password.trim())}
                        />
                        <button
                            type="button"
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--primary-orange)] transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        className={`w-full h-12 rounded-xl bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] hover:from-[var(--primary-orange-hover)] hover:to-[#be4800] text-white font-bold tracking-[0.05em] text-sm shadow-lg shadow-[var(--primary-orange)]/10 hover:shadow-[var(--primary-orange)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group border border-transparent ${!password || loading ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                        onClick={() => onLogin(password.trim())}
                        disabled={loading || !password}
                    >
                        <span className="relative z-10 flex items-center gap-2 transition-colors">
                            {loading ? 'Verifying...' : 'Login'}
                        </span>
                    </button>

                    <button
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary-orange)] hover:text-[var(--primary-orange-hover)] transition-colors py-2"
                        onClick={onForgotPassword}
                        disabled={loading}
                    >
                        Forgot Password?
                    </button>
                </div>
            </div>
        </div>
    )
}
