import { getMyProgramLeads } from '@/app/referral-actions'
import { getActivePrograms } from '@/app/program-actions'
import { getCurrentUser } from '@/lib/auth-service'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { ProgramLeadsList } from './program-leads-list'

export default async function ProgramLeadsPage() {
    const [leads, programsRes, user] = await Promise.all([
        getMyProgramLeads(),
        getActivePrograms(),
        getCurrentUser()
    ])

    const programs = programsRes.success ? programsRes.programs : []

    return (
        <div className="relative">
            <div className="max-w-4xl mx-auto flex flex-col">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-slate-100 hover:border-gray-300 transition-colors shadow-sm">
                            <ChevronLeft size={20} className="text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--deep-black)] uppercase italic font-heading">Program Leads</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Your External Yield Pipeline</p>
                        </div>
                    </div>
                </header>

                <ProgramLeadsList leads={leads} programs={programs} user={user} />
            </div>
        </div>
    )
}
