import React from 'react'
import { TableSkeleton, HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <HeaderSkeleton />

            {/* Filter controls shimmer */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="h-10 w-full sm:w-64 bg-slate-100 rounded-xl skeleton-shimmer" />
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <div className="h-10 w-24 bg-slate-100 rounded-xl skeleton-shimmer" />
                    <div className="h-10 w-32 bg-slate-100 rounded-xl skeleton-shimmer" />
                </div>
            </div>

            {/* Referrals table */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <TableSkeleton rows={7} columns={6} />
            </div>
        </div>
    )
}
