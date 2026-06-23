'use client'

export default function Loading() {
    return (
        <>
            <style>{`
                @keyframes progress-loading {
                    0% { transform: scaleX(0); }
                    50% { transform: scaleX(0.75); }
                    100% { transform: scaleX(1); }
                }
                .animate-progress {
                    animation: progress-loading 2.5s infinite linear;
                }
            `}</style>
            <div className="fixed top-0 left-0 right-0 h-[3px] bg-amber-50 z-[9999] overflow-hidden pointer-events-none">
                <div 
                    className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 animate-progress"
                    style={{ transformOrigin: '0% 50%', width: '100%' }}
                />
            </div>
        </>
    )
}
