import React from 'react'
import { HeaderSkeleton, CardSkeleton, ChartSkeleton, TableSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            <HeaderSkeleton />

            {/* 4-column Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>

            {/* Chart + Side panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartSkeleton />
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                    <div className="h-5 w-1/2 rounded-lg skeleton-shimmer" />
                    <div className="space-y-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0">
                                <div className="h-4 rounded w-28 skeleton-shimmer" />
                                <div className="h-5 rounded w-12 skeleton-shimmer" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                    <div className="h-5 rounded w-48 skeleton-shimmer" />
                    <div className="flex gap-2">
                        <div className="h-9 w-24 rounded-xl skeleton-shimmer" />
                        <div className="h-9 w-28 rounded-xl skeleton-shimmer" />
                    </div>
                </div>
                <TableSkeleton rows={6} columns={6} />
            </div>
        </div>
    )
}
