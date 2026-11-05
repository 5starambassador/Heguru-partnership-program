import type { Metadata } from 'next'
import { Shield, Database, Eye, Share2, Lock, Clock, UserCheck, Trash2, Mail } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Privacy Policy | Heguru Partnership Program',
    description: 'How the Heguru Partnership Program collects, uses, shares and protects your personal data.',
}

const dataWeCollect = [
    { title: 'Account', desc: 'Full name, mobile number, email address, address, password and your role in the program.' },
    { title: 'Identity', desc: 'Aadhaar number (Alumni and Others), year of passing (Alumni) and employee ID (Staff).' },
    { title: 'Student', desc: 'Student name, ERP number, grade, campus and academic year, provided by parents and staff.' },
    { title: 'Bank', desc: 'Bank account details, bank name and IFSC code that you provide to receive payouts.' },
    { title: 'Referrals', desc: 'Name and mobile number of the parent you refer, the student name, and referral and reward history.' },
    { title: 'Media', desc: 'Profile photos and other images you choose to upload.' },
    { title: 'Messages', desc: 'Support tickets and messages you send to our WhatsApp number.' },
    { title: 'Device', desc: 'Notification token, IP address, browser or device type, and activity and security logs.' },
]

const howWeUseIt = [
    'To create your account and verify your mobile number with a one-time password (OTP).',
    'To verify your status as a parent, staff member, alumni or other partner of Heguru.',
    'To track referrals, calculate benefits and send payouts.',
    'To send account messages, reminders and program updates by WhatsApp, email and push notification.',
    'To answer support requests, keep the service secure and prevent misuse.',
]

const serviceProviders = [
    { name: 'MSG91', use: 'Delivers OTPs and WhatsApp messages.' },
    { name: 'Google Firebase', use: 'Delivers push notifications.' },
    { name: 'Google Gemini', use: 'Generates replies to messages sent to our WhatsApp assistant, using the message and your name, role, campus and referral count.' },
    { name: 'Resend', use: 'Delivers email.' },
    { name: 'ImageKit', use: 'Stores and serves uploaded images.' },
    { name: 'Neon and Hostinger', use: 'Host our database and application.' },
    { name: 'Cashfree and GrayQuest', use: 'Process payments, only where a payment is made.' },
]

const sectionClass = 'bg-white border border-gray-250/70 rounded-3xl p-8 shadow-sm'
const headingClass = 'text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'

export default function PrivacyPolicyPage() {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-orange)]/10 border border-[var(--primary-orange)]/20 text-[var(--primary-orange)] text-[10px] font-black uppercase tracking-widest mb-4">
                    <Shield size={12} />
                    Your Privacy
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Privacy Policy</h1>
                <p className="text-lg text-gray-500">Last updated: November 2026</p>
            </div>

            <div className="space-y-8 text-gray-700 leading-relaxed">
                <section className={sectionClass}>
                    <h2 className={headingClass}>
                        <Shield size={20} className="text-[var(--primary-orange)]" />
                        Who We Are
                    </h2>
                    <p>
                        The Heguru Partnership Program (HPP) website and mobile app are operated by Heguru Educational Public Trust, No. 5, Heguru Campus, Villianur, Puducherry - 605 110, India. This policy explains how we handle your personal data when you use them.
                    </p>
                </section>

                <section className={sectionClass}>
                    <h2 className={headingClass}>
                        <Database size={20} className="text-[var(--primary-orange)]" />
                        Data We Collect
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {dataWeCollect.map((item) => (
                            <div key={item.title} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-xs font-black text-gray-900 mb-1 uppercase tracking-tighter">{item.title}</p>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-gray-600">
                        The app does not access your device location or contacts.
                    </p>
                </section>

                <section className={sectionClass}>
                    <h2 className={headingClass}>
                        <Eye size={20} className="text-[var(--primary-orange)]" />
                        How We Use Your Data
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        {howWeUseIt.map((use) => (
                            <li key={use}>{use}</li>
                        ))}
                    </ul>
                </section>

                <section className={sectionClass}>
                    <h2 className={headingClass}>
                        <Share2 size={20} className="text-[var(--primary-orange)]" />
                        How We Share Your Data
                    </h2>
                    <p className="mb-4">
                        We do not sell your personal data. Authorised Heguru staff can access it to run the program, and we share it with these service providers only as needed to run the service:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        {serviceProviders.map((provider) => (
                            <li key={provider.name}>
                                <strong className="text-gray-900">{provider.name}:</strong> {provider.use}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4">
                        We may also disclose data when required by law.
                    </p>
                </section>

                <section className={sectionClass}>
                    <h2 className={headingClass}>
                        <Lock size={20} className="text-[var(--primary-orange)]" />
                        How We Protect Your Data
                    </h2>
                    <p>
                        Data is sent over encrypted HTTPS connections. Passwords are stored as secure hashes, Aadhaar numbers are encrypted, and access to personal data is limited by staff role. No system is completely secure, but we work to protect your data against unauthorised access.
                    </p>
                </section>

                <section className={sectionClass}>
                    <h2 className={headingClass}>
                        <Clock size={20} className="text-[var(--primary-orange)]" />
                        How Long We Keep Your Data
                    </h2>
                    <p>
                        We keep your data while your account is active and for as long as needed to run the program, keep financial and referral records, and meet legal obligations.
                    </p>
                </section>

                <section className={sectionClass}>
                    <h2 className={headingClass}>
                        <UserCheck size={20} className="text-[var(--primary-orange)]" />
                        Your Rights
                    </h2>
                    <p>
                        You can view and correct your details in the Profile section of the app, or contact us for help. You can also ask us to delete your account as described below.
                    </p>
                </section>

                <section id="delete-account" className="scroll-mt-24 bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-8 shadow-sm">
                    <h2 className={headingClass}>
                        <Trash2 size={20} className="text-emerald-600" />
                        Deleting Your Account
                    </h2>
                    <p className="mb-3">You can request deletion in either of these ways:</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
                        <li><strong className="text-gray-900">In the app:</strong> open Profile and choose Delete Account.</li>
                        <li><strong className="text-gray-900">By email:</strong> write to <a href="mailto:5star@heguru.org" className="font-bold text-emerald-700 underline">5star@heguru.org</a> from your registered email, or include your registered mobile number, with the subject &quot;Delete my account&quot;.</li>
                    </ul>
                    <p className="mb-3">
                        Our team reviews each request. When it is approved, we remove your name, mobile number, email, address, profile photo, password, bank account details, Aadhaar number, employee ID and student ERP number from your account.
                    </p>
                    <p>
                        Some records may be kept where needed for program, financial or legal purposes. These can include student name and grade, bank name and IFSC code, and referral and payment history.
                    </p>
                </section>

                <section className={sectionClass}>
                    <h2 className={headingClass}>
                        <Mail size={20} className="text-[var(--primary-orange)]" />
                        Children and Contact
                    </h2>
                    <p className="mb-4">
                        This program is for adults. Accounts are not intended for children, and student details are provided by their parent or by staff.
                    </p>
                    <p>
                        We may update this policy and will change the date above when we do. For privacy questions, email <a href="mailto:5star@heguru.org" className="font-bold text-[var(--primary-orange)] underline">5star@heguru.org</a> or call +91-93634 94745.
                    </p>
                </section>
            </div>
        </div>
    )
}
