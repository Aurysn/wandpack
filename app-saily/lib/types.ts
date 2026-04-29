export type BaggageType = 'hand' | 'checked' | 'both'
export type TripType = 'beach' | 'city' | 'business' | 'hiking'
export type PackingStyle = 'light' | 'heavy'
export type TempPreference = 'cold' | 'hot' | 'normal'

export interface QuizAnswers {
  destination: string
  days: number
  baggage: BaggageType
  tripType: TripType
  packingStyle: PackingStyle
  tempPreference: TempPreference
}

export interface WeatherData {
  city: string
  temperature: number
  description: string
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
