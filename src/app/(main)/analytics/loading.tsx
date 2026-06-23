import React from 'react'
import { ChartSkeleton, CardSkeleton, HeaderSkeleton, TableSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <HeaderSkeleton />

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartSkeleton />
                <ChartSkeleton />
            </div>

            {/* Details report list */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="h-6 w-48 rounded-lg mb-6 skeleton-shimmer" />
                <TableSkeleton rows={5} columns={5} />
            </div>
        </div>
    )
}
