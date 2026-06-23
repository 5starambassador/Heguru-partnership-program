import React from 'react'
import { TableSkeleton, HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <HeaderSkeleton />

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-6 w-48 rounded-lg skeleton-shimmer" />
                    <div className="h-10 w-32 rounded-xl skeleton-shimmer" />
                </div>
                <TableSkeleton rows={6} columns={6} />
            </div>
        </div>
    )
}
