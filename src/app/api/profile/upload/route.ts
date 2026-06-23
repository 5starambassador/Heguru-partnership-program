import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { uploadToImageKit } from '@/lib/imagekit-server'

export async function POST(request: Request) {
    try {
        const session = await getSession()

        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const userId = Number(session.userId)
        const userType = session.userType as 'user' | 'admin'
        const { image } = await request.json()

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 })
        }

        // Upload to ImageKit primary, fallback to raw base64 string
        let storedImage = image
        try {
            const fileName = `profile_${userId}_${Date.now()}.webp`
            const imageKitUrl = await uploadToImageKit(image, fileName)
            if (imageKitUrl) {
                storedImage = imageKitUrl
            }
        } catch (err) {
            console.error('[Profile Upload ImageKit Error] falling back to base64:', err)
        }

        // Update based on user type
        if (userType === 'admin') {
            await prisma.admin.update({
                where: { adminId: userId },
                data: { profileImage: storedImage }
            })
        } else {
            await prisma.user.update({
                where: { userId: userId },
                data: { profileImage: storedImage }
            })
        }

        return NextResponse.json({ success: true, url: storedImage })
    } catch (error) {
        console.error('Profile photo upload error:', error)
        return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 })
    }
}
