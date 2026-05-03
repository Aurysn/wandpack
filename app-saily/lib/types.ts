export type BaggageType = 'hand' | 'checked' | 'both'
export type TripType = 'beach' | 'city' | 'business' | 'hiking'
export type PackingStyle = 'light' | 'heavy'
export type TempPreference = 'cold' | 'hot' | 'normal'

export interface QuizAnswers {
  destination: string
  days: number
  departureDate: string
  baggage: BaggageType
  tripType: TripType
  packingStyle: PackingStyle
  tempPreference: TempPreference
}

export interface CitySuggestion {
  name: string
  country: string
  state?: string
  lat: number
  lon: number
}

export interface DailyForecast {
  date: string
  dayName: string
  tempMin: number
  tempMax: number
  description: string
  emoji: string
}

export interface WeatherData {
  city: string
  country: string
  temperature: number
  tempMin: number
  tempMax: number
  description: string
  isForecast: boolean
  requestedDays: number
  dailyForecasts: DailyForecast[]
}

export interface PackingList {
  clothes: string[]
  toiletries: string[]
  documents: string[]
  electronics: string[]
  extras: string[]
}

export type AppScreen = 'quiz' | 'loading' | 'results'

export type QuizStep = 1 | 2 | 3 | 4 | 5
