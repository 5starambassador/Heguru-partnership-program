import React from 'react'
import { PageSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <PageSkeleton withTable={true} cardsCount={4} />
        </div>
    )
}
