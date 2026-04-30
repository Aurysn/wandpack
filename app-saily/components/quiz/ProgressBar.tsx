interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full">
      <p className="text-xs text-brand-text-secondary mb-2 text-center tracking-wider uppercase">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            data-filled={i < currentStep}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              i < currentStep ? 'bg-brand-gold shadow-gold-sm' : 'bg-brand-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
