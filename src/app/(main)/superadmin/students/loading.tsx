import React from 'react'
import { TableSkeleton, HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <HeaderSkeleton />
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <TableSkeleton rows={8} columns={6} />
            </div>
        </div>
    )
}
