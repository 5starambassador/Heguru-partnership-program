import React from 'react'
import { TableSkeleton, HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            <HeaderSkeleton />

            {/* Tab Selectors */}
            <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200/50 max-w-2xl gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex-1 h-10 rounded-xl skeleton-shimmer" />
                ))}
            </div>

            {/* Main Ledger Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                    <div className="h-5 rounded w-48 skeleton-shimmer" />
                    <div className="flex gap-2">
                        <div className="h-9 w-24 rounded-xl skeleton-shimmer" />
                        <div className="h-9 w-32 rounded-xl skeleton-shimmer" />
                    </div>
                </div>
                <TableSkeleton rows={8} columns={6} />
            </div>
        </div>
    )
}
