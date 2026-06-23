import React from 'react'
import { HeaderSkeleton, CardSkeleton, ChartSkeleton, TableSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            <HeaderSkeleton />
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>

            {/* Performance charts and metrics side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartSkeleton />
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                    <div className="h-5 bg-slate-200 w-1/3 rounded-lg skeleton-shimmer" />
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50">
                                <div className="h-4 bg-slate-100 w-24 rounded-lg skeleton-shimmer" />
                                <div className="h-4 bg-slate-200 w-10 rounded-lg skeleton-shimmer" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Table view */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="h-6 bg-slate-200 w-48 rounded-lg mb-6 skeleton-shimmer" />
                <TableSkeleton rows={6} columns={6} />
            </div>
        </div>
    )
}
