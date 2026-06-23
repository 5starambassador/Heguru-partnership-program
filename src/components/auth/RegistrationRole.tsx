'use client'

import { useState } from 'react'
import { Star, ShieldCheck, User, GraduationCap, ChevronLeft } from 'lucide-react'
import { PrivacyModal } from '@/components/PrivacyModal'
import { getGradesForCampus } from '@/lib/grade-utils'

interface RegistrationRoleProps {
    formData: any
    setFormData: (data: any) => void
    campuses: any[]
    onNext: () => void
    onBack: () => void
    loading: boolean
}

export const RegistrationRole = ({ formData, setFormData, campuses, onNext, onBack, loading }: RegistrationRoleProps) => {
    const [showPrivacy, setShowPrivacy] = useState(false)
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)

    const isFormValid = () => {
        if (formData.role === 'Parent' && (!formData.childEprNo || !formData.grade || !formData.campusId || !formData.childName || !formData.academicYear)) return false
        if (formData.role === 'Staff' && (!formData.empId || !formData.campusId)) return false
        if (formData.role === 'Staff' && formData.childInHeguru === 'Yes' && (!formData.childCampusId || !formData.grade || !formData.childName || !formData.childEprNo || !formData.academicYear)) return false
        if (formData.role === 'Alumni' && ((formData.aadharNo?.length !== 12) || !formData.passoutYear || !formData.campusId)) return false
        if (formData.role === 'Others' && (formData.aadharNo?.length !== 12)) return false
        if (!agreedToPrivacy) return false
        return true
    }

    return (
        <>
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
                    <h2 className="text-3xl font-black text-[var(--deep-black)] tracking-tighter font-heading">Select Profile</h2>
                    <p className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Step 2 of 2</p>
                </div>

                <div className="space-y-4">
                    {/* Role Selection */}
                    <div>
                        <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Membership Level</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['Parent', 'Staff', 'Alumni', 'Others'].map((role) => (
                                <div
                                    key={role}
                                    onClick={() => {
                                        const newRole = role as 'Parent' | 'Staff' | 'Alumni' | 'Others'
                                        setFormData({ ...formData, role: newRole, grade: '', childCampusId: '' })
                                    }}
                                    className={`flex flex-col items-center justify-center gap-2 py-3 px-1 rounded-xl cursor-pointer transition-all border ${formData.role === role ? 'border-[var(--primary-orange)]/60 bg-[var(--primary-orange)]/10 shadow-md shadow-[var(--primary-orange)]/5' : 'border-[var(--warm-gray)] bg-[var(--soft-gray)]/50 hover:bg-[var(--soft-gray)] hover:border-gray-300'}`}
                                >
                                    {role === 'Parent' && <User size={16} className={formData.role === role ? 'text-[var(--primary-orange)]' : 'text-[var(--text-gray)]/60'} />}
                                    {role === 'Staff' && <ShieldCheck size={16} className={formData.role === role ? 'text-[var(--primary-orange)]' : 'text-[var(--text-gray)]/60'} />}
                                    {role === 'Alumni' && <GraduationCap size={16} className={formData.role === role ? 'text-[var(--primary-orange)]' : 'text-[var(--text-gray)]/60'} />}
                                    {role === 'Others' && <Star size={16} className={formData.role === role ? 'text-[var(--primary-orange)]' : 'text-[var(--text-gray)]/60'} />}
                                    <span className={`text-[9px] font-bold uppercase ${formData.role === role ? 'text-[var(--deep-black)]' : 'text-[var(--text-gray)]/60'}`}>{role}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Role Specifics */}
                    <div className="min-h-[140px]">
                        {formData.role === 'Parent' && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div>
                                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Student Name</label>
                                    <input
                                        className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium"
                                        placeholder="Enter Student Name"
                                        value={formData.childName || ''}
                                        onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">ERP Number</label>
                                    <input
                                        className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium"
                                        placeholder="Enter ERP Number"
                                        value={formData.childEprNo || ''}
                                        onChange={(e) => setFormData({ ...formData, childEprNo: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Campus</label>
                                    <select
                                        className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium cursor-pointer"
                                        value={formData.campusId}
                                        onChange={(e) => setFormData({ ...formData, campusId: e.target.value, grade: '' })}
                                    >
                                        <option value="" className="text-gray-400 bg-white">Select Campus</option>
                                        {campuses.map(c => (
                                            <option key={c.id} value={c.id} className="text-[var(--deep-black)] bg-white">{c.campusName}</option>
                                        ))}
                                    </select>
                                </div>
                                {formData.campusId && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Grade</label>
                                        <select
                                            className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium cursor-pointer"
                                            value={formData.grade}
                                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        >
                                            <option value="" className="text-gray-400 bg-white">Select Grade</option>
                                            {getGradesForCampus(formData.campusId, campuses).map(g => (
                                                <option key={g} value={g} className="text-[var(--deep-black)] bg-white">{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Academic Year</label>
                                    <select
                                        className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium cursor-pointer"
                                        value={formData.academicYear || ''}
                                        onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                                    >
                                        <option value="" className="text-gray-400 bg-white">Select Academic Year</option>
                                        <option value="2025-2026" className="text-[var(--deep-black)] bg-white">2025-2026</option>
                                        <option value="2026-2027" className="text-[var(--deep-black)] bg-white">2026-2027</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {formData.role === 'Staff' && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div>
                                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Employee ID</label>
                                    <input
                                        className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium"
                                        placeholder="Enter Employee ID"
                                        value={formData.empId || ''}
                                        onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Working Campus</label>
                                    <select
                                        className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium cursor-pointer"
                                        value={formData.campusId}
                                        onChange={(e) => setFormData({ ...formData, campusId: e.target.value })}
                                    >
                                        <option value="" className="text-gray-400 bg-white">Select Campus</option>
                                        {campuses.map(c => (
                                            <option key={c.id} value={c.id} className="text-[var(--deep-black)] bg-white">{c.campusName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="p-3 bg-[var(--soft-gray)] rounded-xl border border-[var(--warm-gray)]">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-[var(--warm-gray)] text-[var(--primary-orange)] focus:ring-[var(--primary-orange)] bg-white"
                                            checked={formData.childInHeguru === 'Yes'}
                                            onChange={(e) => setFormData({ ...formData, childInHeguru: e.target.checked ? 'Yes' : 'No', childCampusId: '', grade: '' })}
                                        />
                                        <span className="text-sm font-bold text-[var(--deep-black)]">My Child studies in Heguru</span>
                                    </label>
                                </div>

                                {formData.childInHeguru === 'Yes' && (
                                    <div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-300 p-4 bg-[var(--learning-blue)]/5 rounded-xl border border-[var(--learning-blue)]/10 mt-2">
                                        <p className="text-[10px] font-bold text-[var(--learning-blue)] uppercase tracking-widest text-center animate-pulse">Child Information</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Child's Name</label>
                                                <input
                                                    className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium"
                                                    placeholder="Enter Child's Name"
                                                    value={formData.childName || ''}
                                                    onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">ERP Number</label>
                                                <input
                                                    className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium"
                                                    placeholder="Enter ERP Number"
                                                    value={formData.childEprNo || ''}
                                                    onChange={(e) => setFormData({ ...formData, childEprNo: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Child Campus</label>
                                            <select
                                                className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium cursor-pointer"
                                                value={formData.childCampusId}
                                                onChange={(e) => setFormData({ ...formData, childCampusId: e.target.value, grade: '' })}
                                            >
                                                <option value="" className="text-gray-400 bg-white">Select Child's Campus</option>
                                                {campuses.map(c => (
                                                    <option key={c.id} value={c.id} className="text-[var(--deep-black)] bg-white">{c.campusName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {formData.childCampusId && (
                                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Child Grade</label>
                                                <select
                                                    className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium cursor-pointer"
                                                    value={formData.grade}
                                                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                                >
                                                    <option value="" className="text-gray-400 bg-white">Select Grade</option>
                                                    {getGradesForCampus(formData.childCampusId, campuses).map(g => (
                                                        <option key={g} value={g} className="text-[var(--deep-black)] bg-white">{g}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Child Academic Year</label>
                                            <select
                                                className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium cursor-pointer"
                                                value={formData.academicYear || ''}
                                                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                                            >
                                                <option value="" className="text-gray-400 bg-white">Select Academic Year</option>
                                                <option value="2025-2026" className="text-[var(--deep-black)] bg-white">2025-2026</option>
                                                <option value="2026-2027" className="text-[var(--deep-black)] bg-white">2026-2027</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {formData.role === 'Alumni' && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div>
                                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Aadhar Number</label>
                                    <input
                                        className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium"
                                        placeholder="12-digit UIDAI Number"
                                        maxLength={12}
                                        value={formData.aadharNo || ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '')
                                            if (val.length <= 12) setFormData({ ...formData, aadharNo: val })
                                        }}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Year of Passout</label>
                                    <input
                                        className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium"
                                        placeholder="YYYY"
                                        maxLength={4}
                                        value={formData.passoutYear || ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '')
                                            if (val.length <= 4) setFormData({ ...formData, passoutYear: val })
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Campus Studied</label>
                                    <select
                                        className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium cursor-pointer"
                                        value={formData.campusId}
                                        onChange={(e) => setFormData({ ...formData, campusId: e.target.value })}
                                    >
                                        <option value="" className="text-gray-400 bg-white">Select Campus</option>
                                        {campuses.map(c => (
                                            <option key={c.id} value={c.id} className="text-[var(--deep-black)] bg-white">{c.campusName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {formData.role === 'Others' && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div>
                                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Aadhar Number</label>
                                    <input
                                        className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium"
                                        placeholder="12-digit UIDAI Number"
                                        maxLength={12}
                                        value={formData.aadharNo || ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '')
                                            if (val.length <= 12) setFormData({ ...formData, aadharNo: val })
                                        }}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-[var(--text-gray)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Campus (Optional)</label>
                                    <input
                                        className="w-full bg-white border border-[var(--warm-gray)] rounded-xl px-4 h-12 text-[var(--deep-black)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]/50 focus:border-transparent shadow-sm transition-all text-sm font-medium"
                                        placeholder="Enter your school/college/institution name"
                                        value={formData.assignedCampus || ''}
                                        onChange={(e) => setFormData({ ...formData, assignedCampus: e.target.value })}
                                    />
                                    <p className="text-[var(--text-gray)]/60 text-[9px] mt-1.5 ml-1">Leave blank if not affiliated with any institution</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Privacy Consent */}
                <div className="mt-6 flex items-start gap-3 p-4 bg-[var(--soft-gray)] rounded-xl border border-[var(--warm-gray)]">
                    <div className="pt-0.5">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-[var(--warm-gray)] bg-white text-[var(--primary-orange)] focus:ring-[var(--primary-orange)]"
                            checked={agreedToPrivacy}
                            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                        />
                    </div>
                    <p className="text-[10px] text-[var(--text-gray)]/85 leading-relaxed font-medium">
                        I agree to the <button type="button" onClick={() => setShowPrivacy(true)} className="text-[var(--primary-orange)] font-bold underline cursor-pointer hover:text-[var(--primary-orange-hover)] transition-colors">Privacy Policy</button> and consent to data collection for identity verification.
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        className={`w-full h-12 rounded-xl bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-hover)] hover:from-[var(--primary-orange-hover)] hover:to-[#be4800] text-white font-bold tracking-[0.05em] text-sm shadow-lg shadow-[var(--primary-orange)]/10 hover:shadow-[var(--primary-orange)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-transparent ${!isFormValid() || loading ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                        onClick={onNext}
                        disabled={loading || !isFormValid()}
                    >
                        Proceed to Payment
                    </button>
                </div>
            </div>
            <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} sidebarOffset={false} />
        </>
    )
}
