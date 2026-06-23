import React from 'react'
import { TableSkeleton, HeaderSkeleton, CardSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <HeaderSkeleton />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <CardSkeleton /><CardSkeleton /><CardSkeleton />
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                    <div className="h-5 rounded w-40 skeleton-shimmer" />
                    <div className="h-9 w-28 rounded-xl skeleton-shimmer" />
                </div>
                <TableSkeleton rows={6} columns={5} />
            </div>
        </div>
    )
}
