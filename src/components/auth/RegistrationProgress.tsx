import { Check } from 'lucide-react'

const STEPS = ['Verify Mobile', 'Your Details', 'Your Profile']

export const RegistrationProgress = ({ currentStep }: { currentStep: 0 | 1 | 2 }) => (
    <ol className="flex items-start w-full max-w-xs mx-auto" aria-label={`Registration step ${currentStep + 1} of ${STEPS.length}`}>
        {STEPS.map((label, index) => {
            const isDone = index < currentStep
            const isCurrent = index === currentStep

            return (
                <li
                    key={label}
                    className="relative flex-1 flex flex-col items-center gap-1.5"
                    aria-current={isCurrent ? 'step' : undefined}
                >
                    {index > 0 && (
                        <span
                            className={`absolute top-3 right-1/2 w-full h-0.5 -translate-y-1/2 ${index <= currentStep ? 'bg-[var(--primary-orange)]' : 'bg-[var(--warm-gray)]'}`}
                            aria-hidden="true"
                        />
                    )}
                    <span
                        className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${isDone || isCurrent
                            ? 'bg-[var(--primary-orange)] border-[var(--primary-orange)] text-white'
                            : 'bg-white border-[var(--warm-gray)] text-[var(--text-gray)]'
                            }`}
                    >
                        {isDone ? <Check size={12} strokeWidth={3} /> : index + 1}
                    </span>
                    <span className={`text-[10px] font-bold ${isCurrent ? 'text-[var(--deep-black)]' : 'text-[var(--text-gray)]'}`}>
                        {label}
                    </span>
                </li>
            )
        })}
    </ol>
)
