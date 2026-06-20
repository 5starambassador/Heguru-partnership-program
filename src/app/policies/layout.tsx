import Link from 'next/link'
import { ArrowLeft, Shield, Mail, Phone, MapPin } from 'lucide-react'

export default function PolicyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50 text-gray-800 selection:bg-[var(--primary-orange)]/10 font-[family-name:var(--font-outfit)]">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary-orange)]/[0.03] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/[0.03] rounded-full blur-[120px]" />
            </div>

            {/* Navigation Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-250/80">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Back to Home</span>
                    </Link>

                    <div className="flex items-center gap-2 text-gray-900">
                        <Shield size={18} className="text-[var(--primary-orange)]" />
                        <span className="font-bold tracking-tight">HEGURU POLICIES</span>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="relative z-10 pt-24 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white py-8 relative z-10">
                <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} Heguru Educational Public Trust. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/policies/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
                        <Link href="/policies/refund" className="hover:text-gray-900 transition-colors">Refunds</Link>
                        <Link href="/policies/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
