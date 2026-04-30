interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full">
      <p className="text-sm text-gray-500 mb-2 text-center">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            data-filled={i < currentStep}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
