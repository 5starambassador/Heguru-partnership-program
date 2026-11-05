import { FileText, CheckCircle2, Shield, Database, Eye, Lock, ArrowDown } from 'lucide-react'

const dataWeCollect = [
    { title: 'Identity', desc: 'Full Name, Mobile Number, Aadhar Number (for Alumni only).' },
    { title: 'Professional', desc: 'Employee ID and Campus details (for Staff members).' },
    { title: 'System', desc: 'Referral links, transaction history, and reward credits.' },
    { title: 'Media', desc: 'Profile photos you choose to upload.' },
]

const howWeUseIt = [
    'To track referrals and calculate fee benefits accurately.',
    'To verify your status as a parent, staff, or alumni of Heguru.',
    'To process and verify registration payments via transaction IDs.',
]

export default function TermsPage() {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-orange)]/10 border border-[var(--primary-orange)]/20 text-[var(--primary-orange)] text-[10px] font-black uppercase tracking-widest mb-4">
                    <FileText size={12} />
                    Legal Agreement
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Privacy Policy</h1>
                <p className="text-lg text-gray-500">Last updated: November 2026</p>
            </div>

            <div className="space-y-8 text-gray-700 leading-relaxed">
                <a
                    href="#privacy-policy"
                    className="flex items-center gap-4 p-5 bg-emerald-50 border border-emerald-200 rounded-3xl text-emerald-900 hover:bg-emerald-100 transition-colors"
                >
                    <span className="p-2 bg-white rounded-xl text-emerald-600 shrink-0">
                        <Shield size={20} />
                    </span>
                    <span className="flex-1 text-sm font-medium">
                        <strong className="font-black">Your privacy matters.</strong> See section 5 for what data we collect, how we use it, and your rights.
                    </span>
                    <ArrowDown size={18} className="text-emerald-600 shrink-0" />
                </a>

                <section className="bg-white border border-gray-250/70 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-[var(--primary-orange)]" />
                        1. Introduction
                    </h2>
                    <p className="mb-4">
                        Welcome to the Heguru Partnership Program (HPP). By accessing our website and using our services, you agree to be bound by these Terms and Conditions. Please read them carefully.
                    </p>
                    <p>
                        These terms govern your participation in our referral program, use of our digital platforms, and any transactions conducted through our service.
                    </p>
                </section>

                <section className="bg-white border border-gray-250/70 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-[var(--primary-orange)]" />
                        2. Partnership Program
                    </h2>
                    <p className="mb-4">
                        As a registered Partner (Parent, Staff, Alumni), you agree to represent Heguru with integrity.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>Referrals must be genuine leads interested in admission.</li>
                        <li>Rewards are distributed based on the "Confirmed" status of referrals.</li>
                        <li>We reserve the right to disqualify any participant found violating these terms.</li>
                    </ul>
                </section>

                <section className="bg-white border border-gray-250/70 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-[var(--primary-orange)]" />
                        3. Registration & Payments
                    </h2>
                    <p className="mb-4">
                        Registration fees for the program are non-transferable. By making a payment, you confirm that you are authorized to use the payment method provided.
                    </p>
                </section>

                <section className="bg-white border border-gray-250/70 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-[var(--primary-orange)]" />
                        4. Limitation of Liability
                    </h2>
                    <p>
                        Heguru Educational Public Trust shall not be held liable for any indirect, incidental, or consequential damages arising from your use of this service or participation in the program.
                    </p>
                </section>

                <section id="privacy-policy" className="scroll-mt-24 bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-emerald-600" />
                        5. Privacy Policy
                    </h2>
                    <p className="mb-6 text-emerald-900">
                        Your privacy is our priority. We are committed to protecting your personal data and being transparent about how we use it for the Heguru Partnership Program (HPP).
                    </p>

                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-2 mb-3">
                        <Database size={16} className="text-emerald-600" />
                        Data We Collect
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {dataWeCollect.map((item) => (
                            <div key={item.title} className="p-4 bg-white rounded-2xl border border-emerald-100">
                                <p className="text-xs font-black text-gray-900 mb-1 uppercase tracking-tighter">{item.title}</p>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-2 mb-3">
                        <Eye size={16} className="text-emerald-600" />
                        How We Use It
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-6">
                        {howWeUseIt.map((use) => (
                            <li key={use}>{use}</li>
                        ))}
                    </ul>

                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-2 mb-3">
                        <Lock size={16} className="text-emerald-600" />
                        Your Rights
                    </h3>
                    <p className="text-gray-600">
                        You have the right to access, correct, or request deletion of your data through the Profile section of this app. All deletion requests are processed manually by our Super Admin to ensure data integrity.
                    </p>
                </section>

                <div className="text-xs text-gray-400 pt-8 border-t border-gray-200">
                    This document is an electronic record in terms of Information Technology Act, 2000 and rules there under as applicable.
                </div>
            </div>
        </div>
    )
}
