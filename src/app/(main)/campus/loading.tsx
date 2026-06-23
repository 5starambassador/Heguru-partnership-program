import React from 'react'
import { CardSkeleton, TableSkeleton, HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-8 animate-fade-in">
            <HeaderSkeleton />

            {/* Target Progress Bar Widget */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                    <div className="h-5 bg-slate-200 w-1/4 rounded-lg skeleton-shimmer" />
                    <div className="h-5 bg-slate-200 w-10 rounded-lg skeleton-shimmer" />
                </div>
                <div className="h-6 w-full bg-slate-100 rounded-full skeleton-shimmer" />
                <div className="h-4 bg-slate-50 w-1/3 rounded-lg skeleton-shimmer" />
            </div>

            {/* Stats Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>

            {/* Leaderboard Podium & Listings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                    <div className="h-6 bg-slate-200 w-48 rounded-lg mb-6 skeleton-shimmer" />
                    <TableSkeleton rows={5} columns={5} />
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                    <div className="h-5 bg-slate-200 w-1/2 rounded-lg skeleton-shimmer" />
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50">
                                <div className="w-8 h-8 rounded-full bg-slate-100 skeleton-shimmer" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-100 w-24 rounded-lg skeleton-shimmer" />
                                    <div className="h-3 bg-slate-50 w-12 rounded-lg skeleton-shimmer" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
