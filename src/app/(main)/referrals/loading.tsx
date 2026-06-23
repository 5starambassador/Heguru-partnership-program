import React from 'react'
import { TableSkeleton, HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <HeaderSkeleton />

            {/* Referrals search + filter bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="h-10 w-full sm:w-64 rounded-xl skeleton-shimmer" />
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <div className="h-10 w-28 rounded-xl skeleton-shimmer" />
                    <div className="h-10 w-28 rounded-xl skeleton-shimmer" />
                </div>
            </div>

            {/* Referrals table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <TableSkeleton rows={7} columns={6} />
            </div>
        </div>
    )
}
