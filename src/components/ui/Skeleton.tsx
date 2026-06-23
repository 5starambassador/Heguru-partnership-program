'use client'

import React from 'react'

interface SkeletonProps {
    className?: string
    variant?: 'text' | 'rect' | 'circle'
    width?: string | number
    height?: string | number
}

export function Skeleton({
    className = '',
    variant = 'rect',
    width,
    height
}: SkeletonProps) {
    const variantClass =
        variant === 'circle' ? 'rounded-full' :
        variant === 'text'   ? 'rounded-md'   :
        'rounded-xl'

    const style: React.CSSProperties = {
        width:  width  || '100%',
        height: height || '1rem',
    }

    return (
        <div
            className={`skeleton-shimmer ${variantClass} ${className}`}
            style={style}
        />
    )
}

export function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    height={14}
                    width={i === lines - 1 && lines > 1 ? '58%' : '100%'}
                />
            ))}
        </div>
    )
}
