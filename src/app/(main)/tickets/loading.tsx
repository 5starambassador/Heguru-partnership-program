import React from 'react'
import { TableSkeleton, HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <HeaderSkeleton />

            {/* Actions header banner */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                <div className="h-10 w-48 bg-slate-100 rounded-xl skeleton-shimmer" />
                <div className="h-10 w-32 bg-slate-200 rounded-xl skeleton-shimmer" />
            </div>

            {/* Tickets table */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <TableSkeleton rows={5} columns={5} />
            </div>
        </div>
    )
}
