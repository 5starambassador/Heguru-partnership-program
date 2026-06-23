import { headers } from 'next/headers'
import { isDevelopmentMode } from './env-mode'

type SMSProvider = 'mock' | 'twilio' | 'msg91'

interface SMSResponse {
    success: boolean
    messageId?: string
    error?: string
}

const PROVIDER: SMSProvider = (process.env.SMS_PROVIDER as SMSProvider) || 'mock'


export type OTPFlow = 'registration' | 'forgot-password' | 'referral'

const MSG91_CONFIG = {
    authKey: process.env.MSG91_AUTH_KEY || "",
    senderId: process.env.MSG91_SENDER_ID || "HEGAPP",
    templates: {
        registration: process.env.MSG91_TEMPLATE_ID_REGISTRATION || "",
        "forgot-password": process.env.MSG91_TEMPLATE_ID_FORGOT_PASSWORD || "",
        referral: process.env.MSG91_TEMPLATE_ID_REFERRAL || ""
    }
}

class SMSService {
    async sendOTP(mobile: string, otp: string, flow: OTPFlow = 'registration'): Promise<SMSResponse> {
        const message = `Your Heguru OTP is ${otp}. Valid for 3 minutes. Do not share this with anyone.`
        return this.send(mobile, message, otp, flow)
    }

    async sendAlert(mobile: string, message: string): Promise<SMSResponse> {
        return this.send(mobile, message)
    }

    private async send(mobile: string, message: string, otp?: string, flow?: OTPFlow): Promise<SMSResponse> {
        try {
            const isTestMode = isDevelopmentMode()

            // In production (not test mode), we MUST strictly use MSG91
            if (!isTestMode) {
                if (!MSG91_CONFIG.authKey) {
                    console.error('❌ [SMS Service] Production mode error: MSG91_AUTH_KEY is not configured!')
                    return { success: false, error: 'SMS Gateway Configuration Error' }
                }
                return this.sendMsg91(mobile, otp, flow)
            }

            // Priority Check: If we have MSG91 keys, use it
            if (MSG91_CONFIG.authKey) {
                return this.sendMsg91(mobile, otp, flow)
            }

            switch (PROVIDER) {
                case 'twilio':
                    return this.sendTwilio(mobile, message)
                case 'mock':
                default:
                    return this.sendMock(mobile, message)
            }
        } catch (error: any) {
            console.error('SMS Service Error:', error)
            return { success: false, error: error.message }
        }
    }

    private async sendMock(mobile: string, message: string): Promise<SMSResponse> {
        console.log(`\n📱 [MOCK SMS] To: ${mobile} | Message: "${message}"\n`)
        return { success: true, messageId: 'mock-id-' + Date.now() }
    }

    private async sendTwilio(mobile: string, message: string): Promise<SMSResponse> {
        console.warn('Twilio provider not configured, falling back to mock')
        return this.sendMock(mobile, message)
    }

    private async sendMsg91(mobile: string, otp?: string, flow?: OTPFlow): Promise<SMSResponse> {
        if (!otp || !flow) {
            return this.sendMock(mobile, "MSG91 Alert: " + (otp || "No OTP"))
        }

        const templateId = MSG91_CONFIG.templates[flow]

        if (!templateId) {
            console.error(`❌ No template ID configured for flow: ${flow}`)
            return { success: false, error: `Template not configured for ${flow}` }
        }

        try {
            // Sanitize mobile
            let sanitizedMobile = mobile.replace(/\D/g, '')
            if (sanitizedMobile.length > 10 && sanitizedMobile.startsWith('91')) {
                sanitizedMobile = sanitizedMobile.substring(2)
            }

            const finalMobile = '91' + sanitizedMobile

            // MSG91 v5 OTP API - Send OTP using template
            // We construct query string parameters mapping both 'otp' and 'OTP' casing to prevent silent delivery drops.
            const queryParams = new URLSearchParams({
                template_id: templateId,
                mobile: finalMobile,
                authkey: MSG91_CONFIG.authKey,
                otp: otp,
                OTP: otp
            })
            const url = `https://control.msg91.com/api/v5/otp?${queryParams.toString()}`

            const isTestMode = isDevelopmentMode()
            console.log('📤 [MSG91] Sending OTP:', {
                flow,
                templateId,
                mobile: finalMobile,
                otp: isTestMode ? otp : '****',  // Mask OTP in production
                timestamp: new Date().toISOString()
            })

            const response = await fetch(url, {
                method: 'GET'
            })

            const data = await response.json()

            console.log('📥 [MSG91] Response:', {
                status: response.status,
                data: JSON.stringify(data),
                success: data.type === 'success'
            })

            if (data.type === 'success') {
                console.log('✅ [MSG91] OTP sent successfully')
                return { success: true, messageId: data.message || data.request_id }
            } else {
                console.error('❌ [MSG91] Error:', data)
                return { success: false, error: data.message || 'MSG91 API Error' }
            }
        } catch (error: any) {
            console.error('❌ [MSG91] Fetch Error:', error)
            return { success: false, error: error.message }
        }
    }
}

export const smsService = new SMSService()
