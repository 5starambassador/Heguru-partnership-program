import React from 'react'
import { HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-8 max-w-4xl">
            <HeaderSkeleton />

            {/* Quick action grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                        <div className="w-12 h-12 rounded-2xl skeleton-shimmer" />
                        <div className="h-5 rounded w-1/3 skeleton-shimmer" />
                        <div className="h-4 rounded w-2/3 skeleton-shimmer" />
                    </div>
                ))}
            </div>

            {/* FAQ Accordion placeholders */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="h-6 rounded w-1/4 mb-6 skeleton-shimmer" />
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="p-4 border border-slate-100 rounded-2xl">
                        <div className="flex justify-between items-center">
                            <div className="h-4 rounded w-2/3 skeleton-shimmer" />
                            <div className="w-5 h-5 rounded skeleton-shimmer" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
