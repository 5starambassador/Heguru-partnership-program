import prisma from '@/lib/prisma'
import { Metadata } from 'next'
import { OfferClient } from './offer-client'
import { notFound } from 'next/navigation'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const program = await prisma.externalProgram.findUnique({
        where: { slug }
    })

    if (!program) return { title: 'Program Not Found' }

    return {
        title: `${program.title} | Heguru VIP Offer`,
        description: program.description || 'Access this exclusive program through the Heguru Partnership Program.',
        openGraph: {
            title: program.title,
            description: program.description || 'Exclusive Heguru VIP Offer',
            images: ['/images/HEGURU-JAPAN-LOGO.jpeg'], // Using a standard high-quality logo for sharing
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title: program.title,
            description: program.description || 'Exclusive Heguru VIP Offer',
            images: ['/images/HEGURU-JAPAN-LOGO.jpeg']
        }
    }
}

export default async function OfferGatewayPage({ params }: Props) {
    const { slug } = await params
    const program = await prisma.externalProgram.findUnique({
        where: { slug }
    })

    if (!program || !program.isActive) {
        return notFound()
    }

    return <OfferClient programTitle={program.title} />
}
