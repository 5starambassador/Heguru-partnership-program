import { getCurrentUser } from '@/lib/auth-service'
import { redirect } from 'next/navigation'
import { CommunityClient } from './community-client'
import { getCommunityPosts } from '@/app/community-actions'

export const dynamic = 'force-dynamic'

export default async function CommunityPage() {
    const user = await getCurrentUser()
    if (!user) {
        redirect('/')
    }

    const postsResult = await getCommunityPosts()
    const initialPosts = postsResult.success ? (postsResult.posts || []) : []

    return (
        <CommunityClient 
            currentUser={{
                userId: user.userId!,
                fullName: user.fullName,
                profileImage: (user as any).profileImage || '',
                role: user.role,
                isAdmin: user.role.includes('Admin') || user.role === 'Super Admin'
            }}
            initialPosts={initialPosts}
        />
    )
}
