import React from 'react'
import { CardSkeleton, TableSkeleton, HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            <HeaderSkeleton />

            {/* Target Progress Widget */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                    <div className="h-5 rounded w-1/3 skeleton-shimmer" />
                    <div className="h-5 rounded w-12 skeleton-shimmer" />
                </div>
                <div className="h-6 w-full rounded-full skeleton-shimmer" />
                <div className="h-3 rounded w-1/3 skeleton-shimmer" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-50">
                        <div className="h-5 rounded w-40 skeleton-shimmer" />
                    </div>
                    <TableSkeleton rows={5} columns={5} />
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                    <div className="h-5 rounded w-1/2 skeleton-shimmer" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                            <div className="w-9 h-9 rounded-full skeleton-shimmer shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-4 rounded w-24 skeleton-shimmer" />
                                <div className="h-3 rounded w-16 skeleton-shimmer" />
                            </div>
                            <div className="h-5 rounded w-10 skeleton-shimmer" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
