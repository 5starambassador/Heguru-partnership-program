import React from 'react'
import { ProfileSkeleton, HeaderSkeleton } from '@/components/ui/SkeletonLoaders'

export default function Loading() {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <HeaderSkeleton />
            <ProfileSkeleton />
        </div>
    )
}
