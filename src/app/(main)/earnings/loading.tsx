import React from 'react'
import { CardSkeleton, TableSkeleton, HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <HeaderSkeleton />

            {/* Core statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>

            {/* Slabs achievement progress banner skeleton */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="h-5 bg-slate-200 w-1/3 rounded-lg skeleton-shimmer" />
                <div className="h-4 bg-slate-100 w-full rounded-lg skeleton-shimmer" />
                <div className="grid grid-cols-5 gap-3 pt-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-12 bg-slate-50 border border-slate-100 rounded-2xl skeleton-shimmer flex flex-col justify-center px-4" />
                    ))}
                </div>
            </div>

            {/* Payouts list table */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="h-6 bg-slate-200 w-48 rounded-lg mb-6 skeleton-shimmer" />
                <TableSkeleton rows={5} columns={5} />
            </div>
        </div>
    )
}
