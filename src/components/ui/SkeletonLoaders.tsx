import React from 'react'

/**
 * TableSkeleton - Layout-matching table loading placeholder
 * NOTE: skeleton elements must NOT have bg-slate-* classes — the
 * skeleton-shimmer class owns background-color entirely.
 */
export function TableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
    return (
        <div className="w-full">
            {/* Table Header */}
            <div className="bg-slate-50 border-b border-slate-100 p-4">
                <div className="flex gap-4 items-center">
                    {Array.from({ length: columns }).map((_, i) => (
                        <div key={i} className="h-4 rounded flex-1 skeleton-shimmer" />
                    ))}
                </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-100">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="px-4 py-3 bg-white">
                        <div className="flex gap-4 items-center">
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <div
                                    key={colIndex}
                                    className="h-4 rounded flex-1 skeleton-shimmer"
                                    style={{ maxWidth: colIndex === 0 ? '55%' : '100%' }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

/**
 * CardSkeleton - Stats metric card loading placeholder
 */
export function CardSkeleton() {
    return (
        <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm space-y-4">
            {/* Icon + label row */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl skeleton-shimmer shrink-0" />
                <div className="h-3.5 rounded w-1/2 skeleton-shimmer" />
            </div>
            {/* Big number */}
            <div className="h-11 rounded-xl w-3/4 skeleton-shimmer" />
            {/* Sub label */}
            <div className="h-3 rounded w-2/5 skeleton-shimmer" />
            {/* Sparkline */}
            <div className="h-9 rounded-lg w-full skeleton-shimmer mt-2" />
        </div>
    )
}

/**
 * ListSkeleton - List feed item loading placeholder
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full skeleton-shimmer shrink-0" />
                    <div className="flex-1 space-y-2.5">
                        <div className="h-4 rounded w-2/5 skeleton-shimmer" />
                        <div className="h-3 rounded w-3/5 skeleton-shimmer" />
                    </div>
                    <div className="w-20 h-7 rounded-lg skeleton-shimmer shrink-0" />
                </div>
            ))}
        </div>
    )
}

/**
 * ProfileSkeleton - Profile page detail settings form loading placeholder
 */
export function ProfileSkeleton() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                {/* Avatar + name */}
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full skeleton-shimmer shrink-0" />
                    <div className="space-y-3 flex-1">
                        <div className="h-5 rounded w-44 skeleton-shimmer" />
                        <div className="h-3 rounded w-28 skeleton-shimmer" />
                        <div className="h-6 rounded-full w-20 skeleton-shimmer" />
                    </div>
                </div>
                {/* Fields grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-3 rounded w-24 skeleton-shimmer" />
                            <div className="h-11 rounded-xl w-full skeleton-shimmer" />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end pt-2">
                    <div className="w-36 h-11 rounded-xl skeleton-shimmer" />
                </div>
            </div>
        </div>
    )
}

/**
 * DashboardWidgetSkeleton - General dashboard widget loading placeholder
 */
export function DashboardWidgetSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 ${className}`}>
            <div className="flex justify-between items-center">
                <div className="h-5 rounded w-1/3 skeleton-shimmer" />
                <div className="w-8 h-8 rounded-full skeleton-shimmer" />
            </div>
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 rounded-2xl skeleton-shimmer" />
                ))}
            </div>
        </div>
    )
}

/**
 * FormSkeleton - Form settings input loading placeholder
 */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
    return (
        <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="h-5 rounded w-1/4 mb-6 skeleton-shimmer" />
            <div className="space-y-4">
                {Array.from({ length: fields }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-3 rounded w-24 skeleton-shimmer" />
                        <div className="h-11 rounded-xl w-full skeleton-shimmer" />
                    </div>
                ))}
            </div>
            <div className="h-11 rounded-xl w-36 mt-6 skeleton-shimmer" />
        </div>
    )
}

/**
 * ChartSkeleton - Dashboard statistics bar chart loading placeholder
 */
export function ChartSkeleton() {
    const barHeights = ['28%', '45%', '38%', '62%', '55%', '78%', '68%', '88%', '72%', '50%', '80%', '91%']

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="space-y-1.5">
                    <div className="h-5 rounded w-36 skeleton-shimmer" />
                    <div className="h-3 rounded w-52 skeleton-shimmer" />
                </div>
                <div className="flex gap-2">
                    <div className="w-16 h-8 rounded-lg skeleton-shimmer" />
                    <div className="w-16 h-8 rounded-lg skeleton-shimmer" />
                </div>
            </div>
            {/* Chart area */}
            <div className="h-52 flex items-end gap-2 px-1 border-b-2 border-l-2 border-slate-100 relative pt-4">
                {barHeights.map((h, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-t-lg skeleton-shimmer"
                        style={{ height: h }}
                    />
                ))}
            </div>
            {/* X-axis labels */}
            <div className="flex gap-2 px-1">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex-1 h-3 rounded skeleton-shimmer" />
                ))}
            </div>
        </div>
    )
}

/**
 * HeaderSkeleton - Title header + action controls loading placeholder
 */
export function HeaderSkeleton() {
    return (
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
                {/* Icon badge */}
                <div className="w-12 h-12 rounded-xl skeleton-shimmer shrink-0" />
                <div className="space-y-2">
                    <div className="h-6 rounded-lg w-44 skeleton-shimmer" />
                    <div className="h-3.5 rounded w-64 skeleton-shimmer" />
                </div>
            </div>
            <div className="flex gap-2.5">
                <div className="h-10 rounded-xl w-28 skeleton-shimmer" />
                <div className="h-10 rounded-xl w-36 skeleton-shimmer" />
            </div>
        </div>
    )
}

/**
 * SidebarSkeleton - Sidebar loading placeholder (legacy/fallback)
 */
export function SidebarSkeleton() {
    return (
        <div className="w-[280px] h-screen bg-slate-900 p-6 space-y-6">
            <div className="h-12 rounded-2xl skeleton-shimmer opacity-30" />
            <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-10 rounded-xl skeleton-shimmer opacity-20" />
                ))}
            </div>
        </div>
    )
}

/**
 * PageSkeleton - Full page layout container
 */
export function PageSkeleton({ withTable = true, cardsCount = 4 }: { withTable?: boolean; cardsCount?: number }) {
    return (
        <div className="space-y-6">
            <HeaderSkeleton />
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${cardsCount >= 4 ? 'lg:grid-cols-4' : cardsCount === 3 ? 'lg:grid-cols-3' : ''}`}>
                {Array.from({ length: cardsCount }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
            {withTable && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                        <div className="h-5 rounded w-40 skeleton-shimmer" />
                        <div className="flex gap-2">
                            <div className="h-9 w-24 rounded-xl skeleton-shimmer" />
                            <div className="h-9 w-28 rounded-xl skeleton-shimmer" />
                        </div>
                    </div>
                    <TableSkeleton rows={6} columns={5} />
                    {/* Pagination */}
                    <div className="p-4 border-t border-slate-50 flex justify-between items-center">
                        <div className="h-4 w-32 rounded skeleton-shimmer" />
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => <div key={i} className="w-8 h-8 rounded skeleton-shimmer" />)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

/**
 * DashboardSkeleton - Alias for PageSkeleton
 */
export function DashboardSkeleton() {
    return <PageSkeleton withTable={true} cardsCount={4} />
}

/**
 * Generic loading spinner (legacy/fallback)
 */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    }

    return (
        <div className="flex items-center justify-center p-4">
            <div className={`${sizeClasses[size]} border-[var(--primary-orange)] border-t-transparent rounded-full animate-spin`} />
        </div>
    )
}

/**
 * Full page loading state (legacy/fallback)
 */
export function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-slate-500 font-medium text-sm">Loading...</p>
            </div>
        </div>
    )
}
