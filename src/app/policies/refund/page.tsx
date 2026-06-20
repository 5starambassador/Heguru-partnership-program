import { RefreshCcw, AlertCircle } from 'lucide-react'

export default function RefundPage() {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-orange)]/10 border border-[var(--primary-orange)]/20 text-[var(--primary-orange)] text-[10px] font-black uppercase tracking-widest mb-4">
                    <RefreshCcw size={12} />
                    Payment Policy
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Refund Policy</h1>
                <p className="text-lg text-gray-500">Review our cancellation and refund guidelines</p>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
                <div className="bg-amber-50/50 border border-amber-250 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-amber-950 mb-4 flex items-center gap-2">
                        <AlertCircle size={20} className="text-[var(--primary-orange)]" />
                        Registration Fees
                    </h2>
                    <p className="text-lg font-semibold text-amber-900 mb-4">
                        All registration fees paid to Heguru Educational Public Trust for the Heguru Partnership Program (HPP) are non-refundable.
                    </p>
                    <p className="text-amber-850">
                        Once a transaction is successfully completed and your account is activated, we cannot process any cancellations or refunds. The fee covers the administrative costs of setting up your dashboard, generating referral tools, and providing access to our marketing resources.
                    </p>
                </div>

                <section className="bg-white border border-gray-250/70 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Double Payments</h2>
                    <p className="text-gray-600 mb-4">
                        In the unlikely event of a technical error resulting in a duplicate payment for the same registration, please contact our support team immediately with your transaction reference numbers. We will verify and process a refund for the duplicate transaction within 5-7 business days.
                    </p>

                    <h2 className="text-lg font-bold text-gray-900 mb-2">Processing Timeline</h2>
                    <p className="text-gray-600">
                        Approved refunds (for technical errors only) will be credited back to the original source of payment (Bank Account/Card/UPI) within 5-7 business days, subject to your bank's processing timelines.
                    </p>
                </section>
            </div>
        </div>
    )
}
