'use client'

import { useEffect } from 'react'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Capacitor } from '@capacitor/core'
import { App, URLOpenListenerEvent } from '@capacitor/app'
// import { PushNotifications } from '@capacitor/push-notifications'
import { useRouter } from 'next/navigation'

import { useFcmToken } from '@/hooks/useFcmToken'

export function MobileConfig() {
    const router = useRouter()

    // Initialize FCM Token Logic (Web + Native)
    useFcmToken()

    useEffect(() => {
        const configureMobile = async () => {
            if (!Capacitor.isNativePlatform()) return

            try {
                // 1. Status Bar
                await StatusBar.setBackgroundColor({ color: '#DC2626' })
                await StatusBar.setStyle({ style: Style.Dark })

                // 2. Push Notifications
                // Handled by useFcmToken hook now.
                // We just keep listener for deep links here if needed or move it too.

                // 3. Deep Linking
                App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
                    // Example URL: heguru://ambassador/refer or https://partner.heguruindia.com/refer
                    const { pathname, search, hash } = new URL(event.url)
                    router.push(`${pathname || '/'}${search}${hash}`)
                })

            } catch (e) {
                console.error('Error configuring mobile features', e)
            }
        }

        configureMobile()
    }, [router])

    return null
}
