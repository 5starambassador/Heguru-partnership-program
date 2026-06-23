import React from 'react'
import { CardSkeleton, TableSkeleton, HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <HeaderSkeleton />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CardSkeleton /><CardSkeleton /><CardSkeleton />
            </div>

            {/* Slabs progress */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="h-5 rounded w-1/3 skeleton-shimmer" />
                <div className="h-4 rounded-full w-full skeleton-shimmer" />
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 pt-1">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-14 rounded-2xl skeleton-shimmer" />
                    ))}
                </div>
            </div>

            {/* Payouts table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-50">
                    <div className="h-5 rounded w-40 skeleton-shimmer" />
                </div>
                <TableSkeleton rows={5} columns={5} />
            </div>
        </div>
    )
}
