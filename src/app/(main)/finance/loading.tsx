import React from 'react'
import { TableSkeleton, HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            <HeaderSkeleton />

            {/* Tab Selectors */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/50 max-w-2xl">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex-1 h-10 bg-slate-200/50 rounded-xl skeleton-shimmer m-1"></div>
                ))}
            </div>

            {/* Main Ledger Table */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-6 bg-slate-200 w-48 rounded-lg skeleton-shimmer" />
                    <div className="flex gap-2">
                        <div className="h-10 w-24 bg-slate-100 rounded-xl skeleton-shimmer" />
                        <div className="h-10 w-32 bg-slate-100 rounded-xl skeleton-shimmer" />
                    </div>
                </div>
                <TableSkeleton rows={8} columns={6} />
            </div>
        </div>
    )
}
