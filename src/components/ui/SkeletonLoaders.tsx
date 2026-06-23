import React from 'react'

/**
 * TableSkeleton - Layout-matching table loading placeholder
 */
export function TableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
    return (
        <div className="w-full">
            {/* Table Header */}
            <div className="bg-slate-50 border-b border-slate-100 p-4">
                <div className="flex gap-4">
                    {Array.from({ length: columns }).map((_, i) => (
                        <div key={i} className="h-4 bg-slate-200 rounded-lg flex-1 skeleton-shimmer"></div>
                    ))}
                </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-100">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="p-4 bg-white">
                        <div className="flex gap-4">
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <div
                                    key={colIndex}
                                    className="h-4 bg-slate-100 rounded-lg flex-1 skeleton-shimmer"
                                    style={{
                                        maxWidth: colIndex === 0 ? '60%' : '100%',
                                    }}
                                ></div>
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
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-200 skeleton-shimmer shrink-0" />
                <div className="h-4 bg-slate-200 rounded-md w-1/3 skeleton-shimmer" />
            </div>
            <div className="h-10 bg-slate-300 rounded-xl w-3/4 skeleton-shimmer" />
            <div className="h-3 bg-slate-100 rounded-md w-1/2 skeleton-shimmer" />
        </div>
    )
}

/**
 * ListSkeleton - List feed item loading placeholder
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-slate-200 skeleton-shimmer shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/3 skeleton-shimmer" />
                        <div className="h-3 bg-slate-100 rounded w-1/2 skeleton-shimmer" />
                    </div>
                    <div className="w-16 h-6 rounded-lg bg-slate-100 skeleton-shimmer shrink-0" />
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
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-slate-200 skeleton-shimmer" />
                    <div className="space-y-2">
                        <div className="h-5 bg-slate-200 rounded w-40 skeleton-shimmer" />
                        <div className="h-3 bg-slate-100 rounded w-24 skeleton-shimmer" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-3 bg-slate-200 rounded w-24 skeleton-shimmer" />
                            <div className="h-10 bg-slate-50 border border-slate-100 rounded-xl skeleton-shimmer" />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end pt-4">
                    <div className="w-32 h-10 bg-slate-200 rounded-xl skeleton-shimmer" />
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
                <div className="h-5 bg-slate-200 rounded w-1/3 skeleton-shimmer" />
                <div className="w-8 h-8 rounded-full bg-slate-100 skeleton-shimmer" />
            </div>
            <div className="space-y-3">
                <div className="h-12 bg-slate-50 rounded-2xl skeleton-shimmer" />
                <div className="h-12 bg-slate-50 rounded-2xl skeleton-shimmer" />
                <div className="h-12 bg-slate-50 rounded-2xl skeleton-shimmer" />
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
            <div className="h-5 bg-slate-200 rounded w-1/4 mb-6 skeleton-shimmer" />
            <div className="space-y-4">
                {Array.from({ length: fields }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-20 skeleton-shimmer" />
                        <div className="h-10 bg-slate-50 border border-slate-100 rounded-xl skeleton-shimmer" />
                    </div>
                ))}
            </div>
            <div className="h-10 bg-slate-200 rounded-xl w-32 mt-6 skeleton-shimmer" />
        </div>
    )
}

/**
 * ChartSkeleton - Dashboard statistics line/bar chart loading placeholder
 */
export function ChartSkeleton() {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
                <div className="h-5 bg-slate-200 rounded w-1/4 skeleton-shimmer" />
                <div className="flex gap-2">
                    <div className="w-16 h-8 bg-slate-100 rounded-lg skeleton-shimmer" />
                    <div className="w-16 h-8 bg-slate-100 rounded-lg skeleton-shimmer" />
                </div>
            </div>
            {/* Mock bars */}
            <div className="h-48 flex items-end gap-3 pt-6 border-b border-l border-slate-100">
                {Array.from({ length: 12 }).map((_, i) => {
                    const heights = ['20%', '40%', '35%', '60%', '50%', '80%', '70%', '90%', '65%', '45%', '75%', '85%']
                    return (
                        <div
                            key={i}
                            className="flex-1 bg-slate-100 rounded-t-lg skeleton-shimmer"
                            style={{ height: heights[i] }}
                        />
                    )
                })}
            </div>
        </div>
    )
}

/**
 * HeaderSkeleton - Title header navigation loading placeholder
 */
export function HeaderSkeleton() {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="space-y-2">
                <div className="h-8 bg-slate-300 rounded-lg w-48 skeleton-shimmer" />
                <div className="h-4 bg-slate-100 rounded w-72 skeleton-shimmer" />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <div className="h-10 bg-slate-200 rounded-xl w-24 skeleton-shimmer" />
                <div className="h-10 bg-slate-200 rounded-xl w-32 skeleton-shimmer" />
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
            <div className="h-12 bg-white/10 rounded-2xl skeleton-shimmer" />
            <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-10 bg-white/5 rounded-xl skeleton-shimmer" />
                ))}
            </div>
        </div>
    )
}

/**
 * PageSkeleton - Layout component loading wrapper
 */
export function PageSkeleton({ withTable = true, cardsCount = 4 }: { withTable?: boolean; cardsCount?: number }) {
    return (
        <div className="space-y-6">
            <HeaderSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: cardsCount }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
            {withTable && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <TableSkeleton rows={6} columns={5} />
                </div>
            )}
        </div>
    )
}

/**
 * DashboardSkeleton - Original Dashboard Skeleton updated to use shimmer animation
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
            <div
                className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
            ></div>
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
                <p className="mt-4 text-slate-600 font-medium">Loading...</p>
            </div>
        </div>
    )
}
