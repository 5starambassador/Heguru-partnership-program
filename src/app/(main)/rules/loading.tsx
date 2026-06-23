import React from 'react'
import { HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-6 max-w-4xl">
            <HeaderSkeleton />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Rule nav sidebar */}
                <div className="md:col-span-1 space-y-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-9 rounded-xl skeleton-shimmer" />
                    ))}
                </div>
                {/* Rule content pane */}
                <div className="md:col-span-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="h-6 rounded w-1/3 skeleton-shimmer" />

                    <div className="space-y-2.5">
                        <div className="h-4 rounded w-full skeleton-shimmer" />
                        <div className="h-4 rounded w-full skeleton-shimmer" />
                        <div className="h-4 rounded w-5/6 skeleton-shimmer" />
                    </div>

                    <div className="h-px bg-slate-100 w-full" />

                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-3">
                                <div className="w-5 h-5 rounded-full skeleton-shimmer shrink-0 mt-0.5" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 rounded w-2/3 skeleton-shimmer" />
                                    <div className="h-3 rounded w-1/2 skeleton-shimmer" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
