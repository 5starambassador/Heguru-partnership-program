import { FileText, CheckCircle2 } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-orange)]/10 border border-[var(--primary-orange)]/20 text-[var(--primary-orange)] text-[10px] font-black uppercase tracking-widest mb-4">
                    <FileText size={12} />
                    Legal Agreement
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Terms & Conditions</h1>
                <p className="text-lg text-gray-500">Last updated: January 2026</p>
            </div>

            <div className="space-y-8 text-gray-700 leading-relaxed">
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

                <div className="text-xs text-gray-400 pt-8 border-t border-gray-200">
                    This document is an electronic record in terms of Information Technology Act, 2000 and rules there under as applicable.
                </div>
            </div>
        </div>
    )
}
