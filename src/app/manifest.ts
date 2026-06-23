import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Heguru Partnership Program',
        short_name: 'HPP',
        description: 'Heguru Partnership Program (HPP). Refer students, earn admission commissions, and be part of the Heguru community.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#DC2626', // Heguru Red
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
