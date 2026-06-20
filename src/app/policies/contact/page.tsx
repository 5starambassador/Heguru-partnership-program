import { Mail, Phone, MapPin, Building2, Globe } from 'lucide-react'

export default function ContactPage() {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-orange)]/10 border border-[var(--primary-orange)]/20 text-[var(--primary-orange)] text-[10px] font-black uppercase tracking-widest mb-4">
                    <Building2 size={12} />
                    Get in Touch
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Contact Us</h1>
                <p className="text-lg text-gray-500">We're here to help you</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Address Card */}
                <div className="col-span-1 md:col-span-2 bg-white border border-gray-250/70 rounded-3xl p-8 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-[var(--primary-orange)]/10 rounded-2xl text-[var(--primary-orange)]">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Registered Office</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                HEGURU EDUCATIONAL PUBLIC TRUST<br />
                                No. 5, Heguru Campus,<br />
                                Villianur, Puducherry - 605 110.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Phone Card */}
                <div className="bg-white border border-gray-250/70 rounded-3xl p-8 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Phone Support</h3>
                            <p className="text-gray-600 mb-1">General Inquiries:</p>
                            <a href="tel:+919363494745" className="text-xl font-bold text-gray-900 hover:text-emerald-600 transition-colors block mb-4">
                                +91-93634 94745
                            </a>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Mon - Sat, 9:00 AM - 6:00 PM</p>
                        </div>
                    </div>
                </div>

                {/* Email Card */}
                <div className="bg-white border border-gray-250/70 rounded-3xl p-8 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
                            <p className="text-gray-600 mb-1">Support & Queries:</p>
                            <a href="mailto:5star@heguru.org" className="text-xl font-bold text-gray-900 hover:text-purple-650 transition-colors block mb-4">
                                5star@heguru.org
                            </a>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Response within 24 hours</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center">
                <a href="https://heguru.in" target="_blank" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium">
                    <Globe size={14} />
                    Visit our main website at heguru.in
                </a>
            </div>
        </div>
    )
}
