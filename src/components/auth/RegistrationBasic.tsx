import { useState } from 'react'
import { Eye, EyeOff, ChevronLeft, Star } from 'lucide-react'

interface RegistrationBasicProps {
    formData: any
    setFormData: (data: any) => void
    onNext: () => void
    onBack: () => void
}

export const RegistrationBasic = ({ formData, setFormData, onNext, onBack }: RegistrationBasicProps) => {
    const [showRegisterPassword, setShowRegisterPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isValidPassword, setIsValidPassword] = useState(false)

    // Password validation logic
    const validatePassword = (pwd: string) => {
        const minLength = pwd.length >= 8
        const hasUpper = /[A-Z]/.test(pwd)
        const hasNumber = /[0-9]/.test(pwd)
        const hasSpecial = /[!@#$%^&*]/.test(pwd)
        return minLength && hasUpper && hasNumber && hasSpecial
    }

    // Email validation logic
    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const isFormValid = () => {
        if (!formData.fullName || !validateEmail(formData.email) || !validatePassword(formData.password) || formData.password !== formData.confirmPassword) return false
        return true
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
                <div className="flex flex-col items-center gap-2 mb-4 w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--learning-blue)]/10 border border-[var(--learning-blue)]/20 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--learning-blue)] shadow-sm">
                        <Star size={10} className="text-[var(--learning-blue)] fill-[var(--learning-blue)]" />
                        <span>Heguru Partnership Program (HPP)</span>
                    </div>
                    <div className="inline-flex items-center px-4 py-1 rounded-full bg-[var(--primary-orange)]/10 border border-[var(--primary-orange)]/20 text-[9px] font-black text-[var(--primary-orange)] uppercase tracking-[0.2em] shadow-sm">
                        25<sup className="text-[0.6em] ml-0.5">th</sup> <span className="ml-1.5">Year Celebration</span>
                    </div>
                </div>
                <h2 className="text-3xl font-black text-[var(--deep-black)] tracking-tighter font-heading">Create Account</h2>
                <p className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Step 1 of 2</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Full Name</label>
                    <input
                        className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium"
                        value={formData.fullName}
                        placeholder="Your legal name"
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        autoFocus
                    />
                </div>

                <div>
                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Email Address</label>
                    <input
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium"
                        placeholder="name@example.com"
                        value={(formData.email || '').trim()}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase().trim() })}
                    />
                    {formData.email && !validateEmail(formData.email) && (
                        <p className="text-[10px] text-rose-500 mt-1 font-medium ml-1">Please enter a valid email address</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Create Password</label>
                        <div className="relative">
                            <input
                                type={showRegisterPassword ? "text" : "password"}
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck={false}
                                className={`w-full bg-white border border-[var(--warm-gray)] rounded-xl pl-4 pr-10 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium ${isValidPassword ? 'ring-emerald-500/50 focus:ring-emerald-500/50' : ''}`}
                                value={formData.password}
                                placeholder='Strong password'
                                onChange={(e) => {
                                    const val = e.target.value.trim()
                                    setFormData({ ...formData, password: val })
                                    setIsValidPassword(validatePassword(val))
                                }}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--primary-orange)] transition-colors"
                                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            >
                                {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {/* Password Strength Indicators & Requirements Checklist */}
                        <div className="mt-3 space-y-2 px-1">
                            <div className="flex gap-1.5 mb-3">
                                <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${formData.password.length >= 8 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-gray-100'}`}></div>
                                <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${/[A-Z]/.test(formData.password) ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-gray-100'}`}></div>
                                <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${/[0-9]/.test(formData.password) ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-gray-100'}`}></div>
                                <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${/[!@#$%^&*]/.test(formData.password) ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-gray-100'}`}></div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div className={`flex items-center gap-2 transition-all ${formData.password.length >= 8 ? 'text-emerald-500' : 'text-gray-300'}`}>
                                    <div className={`w-1 h-1 rounded-full ${formData.password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider">8+ Characters</span>
                                </div>
                                <div className={`flex items-center gap-2 transition-all ${/[A-Z]/.test(formData.password) ? 'text-emerald-500' : 'text-gray-300'}`}>
                                    <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider">1 Uppercase</span>
                                </div>
                                <div className={`flex items-center gap-2 transition-all ${/[0-9]/.test(formData.password) ? 'text-emerald-500' : 'text-gray-300'}`}>
                                    <div className={`w-1 h-1 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider">1 Number</span>
                                </div>
                                <div className={`flex items-center gap-2 transition-all ${/[!@#$%^&*]/.test(formData.password) ? 'text-emerald-500' : 'text-gray-300'}`}>
                                    <div className={`w-1 h-1 rounded-full ${/[!@#$%^&*]/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider">1 Special</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Confirm</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck={false}
                                className={`w-full bg-white border border-[var(--warm-gray)] rounded-xl pl-4 pr-10 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium ${formData.confirmPassword && formData.password === formData.confirmPassword ? 'ring-emerald-500/50 focus:ring-emerald-500/50' : ''}`}
                                value={formData.confirmPassword}
                                placeholder='Retype password'
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value.trim() })}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--primary-orange)] transition-colors"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <p className="text-[10px] text-rose-500 mt-1 font-bold ml-1 animate-in slide-in-from-top-1 fade-in">
                                Passwords do not match
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <button
                className={`w-full h-12 rounded-xl bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] hover:from-[var(--primary-orange-hover)] hover:to-[#be4800] text-white font-bold tracking-[0.05em] text-sm shadow-lg shadow-[var(--primary-orange)]/10 hover:shadow-[var(--primary-orange)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-transparent ${!isFormValid() ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                onClick={onNext}
                disabled={!isFormValid()}
            >
                Next Step
            </button>
        </div>
    )
}
