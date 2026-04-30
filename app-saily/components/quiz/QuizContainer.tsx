'use client'
import { useState } from 'react'
import ProgressBar from './ProgressBar'
import StepDestination from './StepDestination'
import StepBaggage from './StepBaggage'
import StepTripType from './StepTripType'
import StepPackingStyle from './StepPackingStyle'
import StepTempPreference from './StepTempPreference'
import LoadingScreen from '../loading/LoadingScreen'
import ResultsScreen from '../results/ResultsScreen'
import type { QuizAnswers, WeatherData, PackingList, AppScreen, QuizStep } from '@/lib/types'

type PartialAnswers = Partial<QuizAnswers>

export default function QuizContainer() {
  const [screen, setScreen] = useState<AppScreen>('quiz')
  const [step, setStep] = useState<QuizStep>(1)
  const [answers, setAnswers] = useState<PartialAnswers>({})
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [packingList, setPackingList] = useState<PackingList | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleDestination(destination: string, days: number, departureDate: string) {
    setAnswers((prev) => ({ ...prev, destination, days, departureDate }))
    setError(null)
    setStep(2)
  }

  function handleBaggage(baggage: QuizAnswers['baggage']) {
    setAnswers((prev) => ({ ...prev, baggage }))
    setStep(3)
  }

  function handleTripType(tripType: QuizAnswers['tripType']) {
    setAnswers((prev) => ({ ...prev, tripType }))
    setStep(4)
  }

  function handlePackingStyle(packingStyle: QuizAnswers['packingStyle']) {
    setAnswers((prev) => ({ ...prev, packingStyle }))
    setStep(5)
  }

  function handleTempPreference(tempPreference: QuizAnswers['tempPreference']) {
    setAnswers((prev) => ({ ...prev, tempPreference }))
    setScreen('loading')
  }

  function handleComplete(weatherData: WeatherData | null, list: PackingList) {
    setWeather(weatherData)
    setPackingList(list)
    setScreen('results')
  }

  function handleError(message: string) {
    setError(message)
    setWeather(null)
    setPackingList(null)
    setScreen('quiz')
    setStep(1)
  }

  function handleStartOver() {
    setScreen('quiz')
    setStep(1)
    setAnswers({})
    setWeather(null)
    setPackingList(null)
    setError(null)
  }

  if (screen === 'loading') {
    return (
      <LoadingScreen
        answers={answers as QuizAnswers}
        onComplete={handleComplete}
        onError={handleError}
      />
    )
  }

  if (screen === 'results' && packingList) {
    return (
      <ResultsScreen
        weather={weather}
        packingList={packingList}
        destination={answers.destination ?? ''}
        onStartOver={handleStartOver}
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <ProgressBar currentStep={step} totalSteps={5} />
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div key={step} className="step-animate">
        {step === 1 && (
          <StepDestination
            initialDestination={answers.destination}
            initialDays={answers.days}
            initialDepartureDate={answers.departureDate}
            onNext={handleDestination}
          />
        )}
        {step === 2 && (
          <StepBaggage initialValue={answers.baggage} onNext={handleBaggage} />
        )}
        {step === 3 && (
          <StepTripType initialValue={answers.tripType} onNext={handleTripType} />
        )}
        {step === 4 && (
          <StepPackingStyle initialValue={answers.packingStyle} onNext={handlePackingStyle} />
        )}
        {step === 5 && (
          <StepTempPreference
            initialValue={answers.tempPreference}
            onNext={handleTempPreference}
          />
        )}
      </div>
    </div>
  )
}
