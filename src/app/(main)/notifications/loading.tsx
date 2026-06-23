import React from 'react'
import { ListSkeleton, HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
            <HeaderSkeleton />
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <ListSkeleton count={6} />
            </div>
        </div>
    )
}
