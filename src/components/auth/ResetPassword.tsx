'use client'

import { useState } from 'react'
import { Eye, EyeOff, ChevronLeft, Star } from 'lucide-react'

interface ResetPasswordProps {
    onReset: (password: string, confirm: string) => void
    onCancel: () => void
    loading: boolean
}

export const ResetPassword = ({ onReset, onCancel, loading }: ResetPasswordProps) => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 relative">
                <button
                    onClick={onCancel}
                    className="absolute top-0 left-0 w-10 h-10 rounded-full flex items-center justify-center bg-[var(--soft-gray)] border border-[var(--warm-gray)] text-[var(--deep-black)] hover:bg-[var(--warm-gray)] transition-all z-50 group shadow-md"
                >
                    <ChevronLeft className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
                </button>
                <div className="flex flex-col items-center gap-2 mb-4 w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--learning-blue)]/10 border border-[var(--learning-blue)]/20 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--learning-blue)] shadow-sm">
                        <Star size={10} className="text-[var(--learning-blue)] fill-[var(--learning-blue)]" />
                        <span>Heguru Partnership Program (HPP)</span>
                    </div>
                </div>
                <h2 className="text-xl font-black text-[var(--deep-black)] tracking-tight font-heading">Reset Password</h2>
                <div className="inline-block px-3 py-1 rounded-full bg-[var(--primary-orange)]/10 border border-[var(--primary-orange)]/20">
                    <p className="text-[var(--primary-orange)] text-[10px] font-black uppercase tracking-[0.2em]">New Credentials</p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            className="block w-full bg-white border border-[var(--warm-gray)] rounded-2xl pl-6 pr-12 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-md transition-all text-lg font-medium tracking-wide"
                            placeholder="Min 8 chars"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value.trim())}
                        />
                        <button
                            type="button"
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--primary-orange)] transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Password Strength Indicators & Requirements Checklist */}
                    <div className="mt-4 space-y-3 px-1">
                        <div className="flex gap-2 mb-4">
                            <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${newPassword.length >= 8 ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-gray-100'}`}></div>
                            <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${/[A-Z]/.test(newPassword) ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-gray-100'}`}></div>
                            <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${/[0-9]/.test(newPassword) ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-gray-100'}`}></div>
                            <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${/[!@#$%^&*]/.test(newPassword) ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-gray-100'}`}></div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                            <div className={`flex items-center gap-3 transition-all ${newPassword.length >= 8 ? 'text-emerald-500' : 'text-gray-300'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">8+ Characters</span>
                            </div>
                            <div className={`flex items-center gap-3 transition-all ${/[A-Z]/.test(newPassword) ? 'text-emerald-500' : 'text-gray-300'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">1 Uppercase</span>
                            </div>
                            <div className={`flex items-center gap-3 transition-all ${/[0-9]/.test(newPassword) ? 'text-emerald-500' : 'text-gray-300'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">1 Number</span>
                            </div>
                            <div className={`flex items-center gap-3 transition-all ${/[!@#$%^&*]/.test(newPassword) ? 'text-emerald-500' : 'text-gray-300'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*]/.test(newPassword) ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">1 Special</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Confirm Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        className="block w-full bg-white border border-[var(--warm-gray)] rounded-2xl pl-6 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-md transition-all text-lg font-medium tracking-wide"
                        placeholder="Retype password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        className={`w-full h-12 rounded-xl bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] hover:from-[var(--primary-orange-hover)] hover:to-[#be4800] text-white font-bold tracking-[0.15em] text-sm shadow-lg shadow-[var(--primary-orange)]/10 hover:shadow-[var(--primary-orange)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group border border-transparent ${loading ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                        onClick={() => onReset(newPassword.trim(), confirmNewPassword.trim())}
                        disabled={loading}
                    >
                        <span className="relative z-10 flex items-center gap-2 transition-colors">
                            {loading ? 'Updating...' : 'Save New Password'}
                        </span>
                    </button>

                    <button
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary-orange)] hover:text-[var(--primary-orange-hover)] transition-colors py-2"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
