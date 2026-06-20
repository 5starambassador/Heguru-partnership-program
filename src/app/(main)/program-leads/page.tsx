import { getMyProgramLeads } from '@/app/referral-actions'
import { getActivePrograms } from '@/app/program-actions'
import { getCurrentUser } from '@/lib/auth-service'
import { ArrowLeft, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { ProgramLeadsList } from './program-leads-list'
import { PageItem } from '@/components/PageAnimate'

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
                  <PageItem>
                                    <Link
                                        href="/dashboard"
                                        className="w-max px-4 mb-4 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center gap-1.5 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 shadow-sm group"
                                    >
                                        <ArrowLeft
                                            size={18}
                                            className="text-gray-600 group-hover:text-gray-700 transition-colors"
                                        />
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                                            Back
                                        </span>
                                    </Link>
                                </PageItem>
                                 <div className="flex items-center gap-4">
                            <div className='mb-4'>
                                <h1 className="text-2xl md:text-4xl font-black text-[var(--deep-black)] tracking-tight uppercase  leading-none mb-1 font-heading">
                                    Program Leads
                                </h1>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.25em]">
                                    Your External Yield Pipeline
                                </p>
                            </div>
                        </div>
                <ProgramLeadsList leads={leads} programs={programs} user={user} />
            </div>
        </div>
    )
}
