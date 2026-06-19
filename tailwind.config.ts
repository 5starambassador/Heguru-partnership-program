// Force rebuild - restored git state
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                'ui-primary': "var(--ui-primary)",
                'ui-accent': "var(--ui-accent)",
                'primary-maroon': '#800000',
                'brand-yellow': 'var(--yellow)',
                'primary-orange': 'var(--primary-orange)',
                'primary-orange-hover': 'var(--primary-orange-hover)',
                'deep-black': 'var(--deep-black)',
                'pure-white': 'var(--pure-white)',
                'soft-gray': 'var(--soft-gray)',
                'warm-gray': 'var(--warm-gray)',
                'text-gray': 'var(--text-gray)',
                'japanese-red': 'var(--japanese-red)',
                'success-green': 'var(--success-green)',
                'learning-blue': 'var(--learning-blue)',
            },
            keyframes: {
                shimmer: {
                    '0%': { transform: 'translateX(-100%) rotate(12deg)' },
                    '100%': { transform: 'translateX(500%) rotate(12deg)' },
                },
            },
            animation: {
                shimmer: 'shimmer 3s linear infinite',
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
