import fs from 'fs';
import path from 'path';

let cachedMode: 'development' | 'production' | null = null;

export function getPlatformMode(): 'development' | 'production' {
    if (cachedMode !== null) {
        return cachedMode;
    }

    // 1. Default to process.env.NODE_ENV
    let mode = process.env.NODE_ENV;

    // 2. Overwrite if explicitly defined in the .env file
    // This handles the next dev runtime where process.env.NODE_ENV is forced to 'development'
    try {
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/^NODE_ENV\s*=\s*["']?(production|development)["']?/m);
            if (match && match[1]) {
                const parsedMode = match[1] as 'development' | 'production';
                cachedMode = parsedMode;
                return parsedMode;
            }
        }
    } catch (e) {
        console.error("Failed to read .env file for NODE_ENV:", e);
    }

    const finalMode = mode === 'production' ? 'production' : 'development';
    cachedMode = finalMode;
    return finalMode;
}

export function isDevelopmentMode(): boolean {
    return getPlatformMode() === 'development';
}
