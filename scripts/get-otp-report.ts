import 'dotenv/config'

const authKey = process.env.MSG91_AUTH_KEY || "485538AfzLQYaH69672145P1"

const requestIds = [
    "3666736f5a674c48476d424d",
    "3666736f5a677861466d7258",
    "3666736f5a676f6571466554",
    "366673706175314b45464d4c"
]

async function checkStatus(requestId: string) {
    // MSG91 OTP delivery report URL
    const url = `https://control.msg91.com/api/v5/otp/status?request_id=${requestId}`
    
    try {
        const response = await fetch(url, {
            headers: {
                'authkey': authKey
            }
        })
        const data = await response.text()
        console.log(`Request ID: ${requestId} | Response:`, data)
    } catch (e: any) {
        console.error(`Request ID: ${requestId} | Error:`, e.message)
    }
}

async function run() {
    for (const id of requestIds) {
        await checkStatus(id)
    }
}

run()
