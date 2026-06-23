import React from 'react'
import { HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            <HeaderSkeleton />

            {/* Asset category filter tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/50 max-w-sm">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex-1 h-9 bg-slate-200/50 rounded-xl skeleton-shimmer m-0.5"></div>
                ))}
            </div>

            {/* Marketing download cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm space-y-4">
                        {/* Mock image area */}
                        <div className="w-full h-40 rounded-2xl bg-slate-100 skeleton-shimmer" />
                        <div className="space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-2/3 skeleton-shimmer" />
                            <div className="h-3 bg-slate-100 rounded w-1/2 skeleton-shimmer" />
                        </div>
                        <div className="h-10 bg-slate-200 rounded-xl w-full skeleton-shimmer" />
                    </div>
                ))}
            </div>
        </div>
    )
}
