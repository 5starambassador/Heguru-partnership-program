import React from 'react'
import { TableSkeleton, HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
            <HeaderSkeleton />

            {/* Podium — 3 ranking columns side by side */}
            <div className="flex flex-col md:flex-row items-end justify-center gap-6 py-8">
                {/* 2nd Place */}
                <div className="flex flex-col items-center w-full md:w-48">
                    <div className="w-16 h-16 rounded-full skeleton-shimmer mb-4" />
                    <div className="h-4 w-24 rounded-lg skeleton-shimmer mb-2" />
                    <div className="h-32 w-full bg-slate-50 rounded-t-2xl border-t border-x border-slate-100 flex flex-col justify-end p-4">
                        <div className="h-6 w-8 rounded-lg mx-auto skeleton-shimmer" />
                    </div>
                </div>
                {/* 1st Place */}
                <div className="flex flex-col items-center w-full md:w-52">
                    <div className="w-20 h-20 rounded-full skeleton-shimmer mb-4 border-4 border-white shadow-md" />
                    <div className="h-5 w-32 rounded-lg skeleton-shimmer mb-2" />
                    <div className="h-40 w-full bg-slate-50 rounded-t-3xl border-t border-x border-slate-100 flex flex-col justify-end p-4">
                        <div className="h-8 w-10 rounded-lg mx-auto skeleton-shimmer" />
                    </div>
                </div>
                {/* 3rd Place */}
                <div className="flex flex-col items-center w-full md:w-48">
                    <div className="w-16 h-16 rounded-full skeleton-shimmer mb-4" />
                    <div className="h-4 w-20 rounded-lg skeleton-shimmer mb-2" />
                    <div className="h-24 w-full bg-slate-50 rounded-t-2xl border-t border-x border-slate-100 flex flex-col justify-end p-4">
                        <div className="h-6 w-8 rounded-lg mx-auto skeleton-shimmer" />
                    </div>
                </div>
            </div>

            {/* Standings Table */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <TableSkeleton rows={7} columns={4} />
            </div>
        </div>
    )
}
