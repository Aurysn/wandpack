# Smart Trip Packing Assistant (Saily) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 5-step questionnaire web app in `/app-saily` that fetches real weather data and generates a personalised AI packing list via Gemini.

**Architecture:** Single-page Next.js 14 App Router app with all quiz state managed client-side in a `QuizContainer` component. The app renders one of three screens (`quiz`, `loading`, `results`) based on app state. Weather is fetched client-side from OpenWeatherMap (public key). Gemini is called server-side via a Next.js API route to keep the key secure.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, @google/generative-ai, Jest + @testing-library/react

---

## File Map

All files live inside `app-saily/` at the project root.

| File | Responsibility |
|------|----------------|
| `app/layout.tsx` | Root HTML shell and metadata |
| `app/globals.css` | Tailwind base imports |
| `app/page.tsx` | Renders QuizContainer (client entry point) |
| `app/api/generate-packing-list/route.ts` | Server route: calls Gemini, returns packing list JSON |
| `lib/types.ts` | All shared TypeScript interfaces |
| `lib/weather.ts` | Fetches weather from OpenWeatherMap |
| `lib/buildPrompt.ts` | Builds Gemini prompt string from quiz answers + weather |
| `components/quiz/QuizContainer.tsx` | Manages screen state (quiz/loading/results) and quiz answers |
| `components/quiz/ProgressBar.tsx` | Step N of 5 indicator |
| `components/quiz/ChoiceCard.tsx` | Reusable single-choice card |
| `components/quiz/StepDestination.tsx` | Step 1: city name + days inputs |
| `components/quiz/StepBaggage.tsx` | Step 2: baggage choice cards |
| `components/quiz/StepTripType.tsx` | Step 3: trip type choice cards |
| `components/quiz/StepPackingStyle.tsx` | Step 4: packing style choice cards |
| `components/quiz/StepTempPreference.tsx` | Step 5: temperature preference cards |
| `components/loading/LoadingScreen.tsx` | Triggers both API calls, shows spinner, advances to results |
| `components/results/WeatherSummary.tsx` | City, temperature, conditions banner |
| `components/results/PackingCategory.tsx` | One category of items as checkboxes |
| `components/results/PackingProgress.tsx` | "X of Y items packed" progress bar |
| `components/results/ResultsScreen.tsx` | Composes results view from the above |
| `__tests__/lib/weather.test.ts` | Unit tests: weather fetch success + graceful error fallback |
| `__tests__/lib/buildPrompt.test.ts` | Unit tests: prompt string contains all quiz fields |
| `__tests__/components/ProgressBar.test.tsx` | Renders correct step label |
| `__tests__/components/ChoiceCard.test.tsx` | Calls onClick, shows selected state |

---

## Task 1: Scaffold Next.js 14 app in `/app-saily`

**Files:**
- Create: `app-saily/` (full Next.js scaffold)
- Create: `app-saily/.env.example`
- Modify: `app-saily/.gitignore`

- [ ] **Step 1: Run create-next-app (non-interactive)**

From the project root `/Users/aurimasnausutis/Desktop/Saily Project`:

```bash
npx create-next-app@14 app-saily \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-git
```

Expected output: `Success! Created app-saily at .../app-saily`

- [ ] **Step 2: Install @google/generative-ai**

```bash
cd app-saily && npm install @google/generative-ai
```

Expected: package added to node_modules and package.json dependencies.

- [ ] **Step 3: Install Jest and Testing Library**

```bash
cd app-saily && npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest ts-jest
```

- [ ] **Step 4: Create jest.config.ts**

Create `app-saily/jest.config.ts`:

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
}

export default createJestConfig(config)
```

- [ ] **Step 5: Note on jest-dom**

Each test file that uses `@testing-library/jest-dom` matchers must import it at the top:

```typescript
import '@testing-library/jest-dom'
```

This is already included in the test files defined in Tasks 6 and 7. No global setup file is required.

- [ ] **Step 6: Add test script to package.json**

In `app-saily/package.json`, add to the `scripts` section:

```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 7: Create .env.example**

Create `app-saily/.env.example`:

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweathermap_key_here
GEMINI_API_KEY=your_gemini_key_here
```

- [ ] **Step 8: Ensure .env.local is gitignored**

Open `app-saily/.gitignore` and confirm `.env.local` is listed. If not, add:

```
.env.local
```

- [ ] **Step 9: Verify dev server starts**

```bash
cd app-saily && npm run dev
```

Expected: Server running at http://localhost:3000 with the default Next.js page. Stop the server (Ctrl+C).

- [ ] **Step 10: Commit**

```bash
cd app-saily && git -C .. add app-saily/ && git -C .. commit -m "feat: scaffold Next.js 14 app-saily with TypeScript, Tailwind, Jest"
```

---

## Task 2: Shared TypeScript types

**Files:**
- Create: `app-saily/lib/types.ts`

- [ ] **Step 1: Create lib/types.ts**

Create `app-saily/lib/types.ts`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
cd app-saily && git -C .. add app-saily/lib/types.ts && git -C .. commit -m "feat: add shared TypeScript types"
```

---

## Task 3: Weather utility

**Files:**
- Create: `app-saily/lib/weather.ts`
- Create: `app-saily/__tests__/lib/weather.test.ts`

- [ ] **Step 1: Write the failing tests first**

Create `app-saily/__tests__/lib/weather.test.ts`:

```typescript
import { fetchWeather } from '@/lib/weather'

global.fetch = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
})

describe('fetchWeather', () => {
  it('returns weather data on success', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: 'Tokyo',
        main: { temp: 18.3 },
        weather: [{ description: 'light rain' }],
      }),
    })

    const result = await fetchWeather('Tokyo', 'test-api-key')

    expect(result).toEqual({
      city: 'Tokyo',
      temperature: 18,
      description: 'light rain',
    })
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('Tokyo')
    )
  })

  it('returns null when the API request fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false })

    const result = await fetchWeather('Nowhere', 'test-api-key')

    expect(result).toBeNull()
  })

  it('returns null when fetch throws a network error', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const result = await fetchWeather('Somewhere', 'test-api-key')

    expect(result).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

```bash
cd app-saily && npx jest __tests__/lib/weather.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '@/lib/weather'`

- [ ] **Step 3: Implement lib/weather.ts**

Create `app-saily/lib/weather.ts`:

```typescript
import type { WeatherData } from './types'

export async function fetchWeather(
  city: string,
  apiKey: string
): Promise<WeatherData | null> {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    const res = await fetch(url)
    if (!res.ok) return null

    const data = await res.json()
    return {
      city: data.name as string,
      temperature: Math.round(data.main.temp as number),
      description: data.weather[0].description as string,
    }
  } catch {
    return null
  }
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd app-saily && npx jest __tests__/lib/weather.test.ts --no-coverage
```

Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
cd app-saily && git -C .. add app-saily/lib/weather.ts app-saily/__tests__/lib/weather.test.ts && git -C .. commit -m "feat: add weather utility with tests"
```

---

## Task 4: Gemini prompt builder

**Files:**
- Create: `app-saily/lib/buildPrompt.ts`
- Create: `app-saily/__tests__/lib/buildPrompt.test.ts`

- [ ] **Step 1: Write failing tests**

Create `app-saily/__tests__/lib/buildPrompt.test.ts`:

```typescript
import { buildGeminiPrompt } from '@/lib/buildPrompt'
import type { QuizAnswers, WeatherData } from '@/lib/types'

const answers: QuizAnswers = {
  destination: 'Tokyo',
  days: 7,
  baggage: 'checked',
  tripType: 'city',
  packingStyle: 'light',
  tempPreference: 'normal',
}

const weather: WeatherData = {
  city: 'Tokyo',
  temperature: 18,
  description: 'light rain',
}

describe('buildGeminiPrompt', () => {
  it('includes all quiz fields in the prompt', () => {
    const prompt = buildGeminiPrompt(answers, weather)
    expect(prompt).toContain('Tokyo')
    expect(prompt).toContain('7 days')
    expect(prompt).toContain('18°C')
    expect(prompt).toContain('light rain')
    expect(prompt).toContain('checked')
    expect(prompt).toContain('city')
    expect(prompt).toContain('light')
    expect(prompt).toContain('normal')
  })

  it('handles missing weather gracefully', () => {
    const prompt = buildGeminiPrompt(answers, null)
    expect(prompt).toContain('Tokyo')
    expect(prompt).toContain('weather data unavailable')
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

```bash
cd app-saily && npx jest __tests__/lib/buildPrompt.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '@/lib/buildPrompt'`

- [ ] **Step 3: Implement lib/buildPrompt.ts**

Create `app-saily/lib/buildPrompt.ts`:

```typescript
import type { QuizAnswers, WeatherData } from './types'

const BAGGAGE_LABELS: Record<QuizAnswers['baggage'], string> = {
  hand: 'Hand luggage only',
  checked: 'Checked bag',
  both: 'Both hand luggage and checked bag',
}

const TRIP_LABELS: Record<QuizAnswers['tripType'], string> = {
  beach: 'Beach',
  city: 'City trip',
  business: 'Business',
  hiking: 'Hiking',
}

const PACKING_LABELS: Record<QuizAnswers['packingStyle'], string> = {
  light: 'Pack light (only the essentials)',
  heavy: 'Pack heavy (bring everything just in case)',
}

const TEMP_LABELS: Record<QuizAnswers['tempPreference'], string> = {
  cold: 'Runs cold',
  hot: 'Runs hot',
  normal: 'normal',
}

export function buildGeminiPrompt(
  answers: QuizAnswers,
  weather: WeatherData | null
): string {
  const weatherLine = weather
    ? `${weather.description}, ${weather.temperature}°C`
    : 'weather data unavailable'

  return `You are a smart travel packing assistant. Generate a packing list for the following trip:
- Destination: ${answers.destination}
- Duration: ${answers.days} days
- Current weather: ${weatherLine}
- Baggage: ${BAGGAGE_LABELS[answers.baggage]}
- Trip type: ${TRIP_LABELS[answers.tripType]}
- Packing style: ${PACKING_LABELS[answers.packingStyle]}
- Temperature preference: ${TEMP_LABELS[answers.tempPreference]}

Return a JSON object with this exact structure:
{
  "clothes": ["item1", "item2"],
  "toiletries": ["item1", "item2"],
  "documents": ["item1", "item2"],
  "electronics": ["item1", "item2"],
  "extras": ["item1", "item2"]
}

Be smart: pack more clothes for longer trips, add rain gear if weather is wet, add sunscreen if hot and sunny, adjust quantity based on packing style, adjust warmth of clothing based on temperature preference. Return only valid JSON, no other text.`
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd app-saily && npx jest __tests__/lib/buildPrompt.test.ts --no-coverage
```

Expected: PASS — 2 tests passing.

- [ ] **Step 5: Commit**

```bash
cd app-saily && git -C .. add app-saily/lib/buildPrompt.ts app-saily/__tests__/lib/buildPrompt.test.ts && git -C .. commit -m "feat: add Gemini prompt builder with tests"
```

---

## Task 5: Gemini API route

**Files:**
- Create: `app-saily/app/api/generate-packing-list/route.ts`

- [ ] **Step 1: Create the API route**

Create `app-saily/app/api/generate-packing-list/route.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { buildGeminiPrompt } from '@/lib/buildPrompt'
import type { QuizAnswers, WeatherData, PackingList } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { answers, weather }: { answers: QuizAnswers; weather: WeatherData | null } =
    await req.json()

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 })
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = buildGeminiPrompt(answers, weather)
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    const json = text.startsWith('```')
      ? text.replace(/```json\n?/, '').replace(/```$/, '').trim()
      : text

    const packingList: PackingList = JSON.parse(json)
    return NextResponse.json(packingList)
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json({ error: 'Failed to generate packing list' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd app-saily && git -C .. add app-saily/app/api/generate-packing-list/route.ts && git -C .. commit -m "feat: add Gemini API route for packing list generation"
```

---

## Task 6: ProgressBar component

**Files:**
- Create: `app-saily/components/quiz/ProgressBar.tsx`
- Create: `app-saily/__tests__/components/ProgressBar.test.tsx`

- [ ] **Step 1: Write failing test**

Create `app-saily/__tests__/components/ProgressBar.test.tsx`:

```typescript
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ProgressBar from '@/components/quiz/ProgressBar'

describe('ProgressBar', () => {
  it('renders current step and total', () => {
    render(<ProgressBar currentStep={2} totalSteps={5} />)
    expect(screen.getByText(/step 2 of 5/i)).toBeInTheDocument()
  })

  it('renders filled segments for completed steps', () => {
    const { container } = render(<ProgressBar currentStep={3} totalSteps={5} />)
    const filled = container.querySelectorAll('[data-filled="true"]')
    expect(filled).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

```bash
cd app-saily && npx jest __tests__/components/ProgressBar.test.tsx --no-coverage
```

Expected: FAIL — `Cannot find module '@/components/quiz/ProgressBar'`

- [ ] **Step 3: Implement ProgressBar.tsx**

Create `app-saily/components/quiz/ProgressBar.tsx`:

```typescript
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
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd app-saily && npx jest __tests__/components/ProgressBar.test.tsx --no-coverage
```

Expected: PASS — 2 tests passing.

- [ ] **Step 5: Commit**

```bash
cd app-saily && git -C .. add app-saily/components/quiz/ProgressBar.tsx app-saily/__tests__/components/ProgressBar.test.tsx && git -C .. commit -m "feat: add ProgressBar component"
```

---

## Task 7: ChoiceCard component

**Files:**
- Create: `app-saily/components/quiz/ChoiceCard.tsx`
- Create: `app-saily/__tests__/components/ChoiceCard.test.tsx`

- [ ] **Step 1: Write failing test**

Create `app-saily/__tests__/components/ChoiceCard.test.tsx`:

```typescript
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import ChoiceCard from '@/components/quiz/ChoiceCard'

describe('ChoiceCard', () => {
  it('renders the label', () => {
    render(<ChoiceCard emoji="🏖️" label="Beach" selected={false} onClick={jest.fn()} />)
    expect(screen.getByText('Beach')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()
    render(<ChoiceCard emoji="🏖️" label="Beach" selected={false} onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies selected styles when selected is true', () => {
    const { container } = render(
      <ChoiceCard emoji="🏖️" label="Beach" selected={true} onClick={jest.fn()} />
    )
    expect(container.firstChild).toHaveClass('border-indigo-600')
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

```bash
cd app-saily && npx jest __tests__/components/ChoiceCard.test.tsx --no-coverage
```

Expected: FAIL — `Cannot find module '@/components/quiz/ChoiceCard'`

- [ ] **Step 3: Implement ChoiceCard.tsx**

Create `app-saily/components/quiz/ChoiceCard.tsx`:

```typescript
interface ChoiceCardProps {
  emoji: string
  label: string
  selected: boolean
  onClick: () => void
}

export default function ChoiceCard({ emoji, label, selected, onClick }: ChoiceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 w-full cursor-pointer ${
        selected
          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
          : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-gray-50'
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-medium text-center leading-tight">{label}</span>
    </button>
  )
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd app-saily && npx jest __tests__/components/ChoiceCard.test.tsx --no-coverage
```

Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
cd app-saily && git -C .. add app-saily/components/quiz/ChoiceCard.tsx app-saily/__tests__/components/ChoiceCard.test.tsx && git -C .. commit -m "feat: add ChoiceCard component"
```

---

## Task 8: Quiz step components (Steps 1–5)

**Files:**
- Create: `app-saily/components/quiz/StepDestination.tsx`
- Create: `app-saily/components/quiz/StepBaggage.tsx`
- Create: `app-saily/components/quiz/StepTripType.tsx`
- Create: `app-saily/components/quiz/StepPackingStyle.tsx`
- Create: `app-saily/components/quiz/StepTempPreference.tsx`

Each step receives the current partial quiz answers and an `onNext` callback that passes the step's selections forward.

- [ ] **Step 1: Create StepDestination.tsx**

Create `app-saily/components/quiz/StepDestination.tsx`:

```typescript
'use client'
import { useState } from 'react'

interface StepDestinationProps {
  initialDestination?: string
  initialDays?: number
  onNext: (destination: string, days: number) => void
}

export default function StepDestination({
  initialDestination = '',
  initialDays = 7,
  onNext,
}: StepDestinationProps) {
  const [destination, setDestination] = useState(initialDestination)
  const [days, setDays] = useState(initialDays)

  const canContinue = destination.trim().length > 0 && days > 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Where are you going?</h2>
        <p className="text-gray-500 text-sm">Enter your destination city</p>
      </div>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="e.g. Tokyo, Paris, New York"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How many days?
          </label>
          <input
            type="number"
            min={1}
            max={90}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-900 transition-colors"
          />
        </div>
      </div>
      <button
        onClick={() => onNext(destination.trim(), days)}
        disabled={!canContinue}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Create StepBaggage.tsx**

Create `app-saily/components/quiz/StepBaggage.tsx`:

```typescript
'use client'
import { useState } from 'react'
import ChoiceCard from './ChoiceCard'
import type { BaggageType } from '@/lib/types'

interface StepBaggageProps {
  initialValue?: BaggageType
  onNext: (baggage: BaggageType) => void
}

const OPTIONS: { value: BaggageType; emoji: string; label: string }[] = [
  { value: 'hand', emoji: '👜', label: 'Hand luggage only' },
  { value: 'checked', emoji: '🧳', label: 'Checked bag' },
  { value: 'both', emoji: '✈️', label: 'Both' },
]

export default function StepBaggage({ initialValue, onNext }: StepBaggageProps) {
  const [selected, setSelected] = useState<BaggageType | null>(initialValue ?? null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">What baggage are you bringing?</h2>
        <p className="text-gray-500 text-sm">Choose your luggage setup</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {OPTIONS.map((opt) => (
          <ChoiceCard
            key={opt.value}
            emoji={opt.emoji}
            label={opt.label}
            selected={selected === opt.value}
            onClick={() => setSelected(opt.value)}
          />
        ))}
      </div>
      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Create StepTripType.tsx**

Create `app-saily/components/quiz/StepTripType.tsx`:

```typescript
'use client'
import { useState } from 'react'
import ChoiceCard from './ChoiceCard'
import type { TripType } from '@/lib/types'

interface StepTripTypeProps {
  initialValue?: TripType
  onNext: (tripType: TripType) => void
}

const OPTIONS: { value: TripType; emoji: string; label: string }[] = [
  { value: 'beach', emoji: '🏖️', label: 'Beach' },
  { value: 'city', emoji: '🏙️', label: 'City trip' },
  { value: 'business', emoji: '💼', label: 'Business' },
  { value: 'hiking', emoji: '🥾', label: 'Hiking' },
]

export default function StepTripType({ initialValue, onNext }: StepTripTypeProps) {
  const [selected, setSelected] = useState<TripType | null>(initialValue ?? null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">What kind of trip?</h2>
        <p className="text-gray-500 text-sm">Choose the type that fits best</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <ChoiceCard
            key={opt.value}
            emoji={opt.emoji}
            label={opt.label}
            selected={selected === opt.value}
            onClick={() => setSelected(opt.value)}
          />
        ))}
      </div>
      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Create StepPackingStyle.tsx**

Create `app-saily/components/quiz/StepPackingStyle.tsx`:

```typescript
'use client'
import { useState } from 'react'
import ChoiceCard from './ChoiceCard'
import type { PackingStyle } from '@/lib/types'

interface StepPackingStyleProps {
  initialValue?: PackingStyle
  onNext: (packingStyle: PackingStyle) => void
}

const OPTIONS: { value: PackingStyle; emoji: string; label: string }[] = [
  { value: 'light', emoji: '🪶', label: 'Pack light (only the essentials)' },
  { value: 'heavy', emoji: '📦', label: 'Pack heavy (bring everything just in case)' },
]

export default function StepPackingStyle({ initialValue, onNext }: StepPackingStyleProps) {
  const [selected, setSelected] = useState<PackingStyle | null>(initialValue ?? null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">How do you like to pack?</h2>
        <p className="text-gray-500 text-sm">Your packing philosophy</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <ChoiceCard
            key={opt.value}
            emoji={opt.emoji}
            label={opt.label}
            selected={selected === opt.value}
            onClick={() => setSelected(opt.value)}
          />
        ))}
      </div>
      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
```

- [ ] **Step 5: Create StepTempPreference.tsx**

Create `app-saily/components/quiz/StepTempPreference.tsx`:

```typescript
'use client'
import { useState } from 'react'
import ChoiceCard from './ChoiceCard'
import type { TempPreference } from '@/lib/types'

interface StepTempPreferenceProps {
  initialValue?: TempPreference
  onNext: (tempPreference: TempPreference) => void
}

const OPTIONS: { value: TempPreference; emoji: string; label: string }[] = [
  { value: 'cold', emoji: '🥶', label: 'I run cold' },
  { value: 'hot', emoji: '🥵', label: 'I run hot' },
  { value: 'normal', emoji: '😊', label: 'Somewhere in between' },
]

export default function StepTempPreference({ initialValue, onNext }: StepTempPreferenceProps) {
  const [selected, setSelected] = useState<TempPreference | null>(initialValue ?? null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">How do you feel temperature?</h2>
        <p className="text-gray-500 text-sm">This helps us suggest the right clothing</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {OPTIONS.map((opt) => (
          <ChoiceCard
            key={opt.value}
            emoji={opt.emoji}
            label={opt.label}
            selected={selected === opt.value}
            onClick={() => setSelected(opt.value)}
          />
        ))}
      </div>
      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
      >
        Build my packing list
      </button>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
cd app-saily && git -C .. add app-saily/components/quiz/ && git -C .. commit -m "feat: add all 5 quiz step components"
```

---

## Task 9: LoadingScreen component

**Files:**
- Create: `app-saily/components/loading/LoadingScreen.tsx`

This component runs both API calls in sequence (weather → Gemini) and calls `onComplete` with the results. On mount it immediately starts the async work.

- [ ] **Step 1: Create LoadingScreen.tsx**

Create `app-saily/components/loading/LoadingScreen.tsx`:

```typescript
'use client'
import { useEffect } from 'react'
import { fetchWeather } from '@/lib/weather'
import type { QuizAnswers, WeatherData, PackingList } from '@/lib/types'

interface LoadingScreenProps {
  answers: QuizAnswers
  onComplete: (weather: WeatherData | null, packingList: PackingList) => void
  onError: (message: string) => void
}

export default function LoadingScreen({ answers, onComplete, onError }: LoadingScreenProps) {
  useEffect(() => {
    async function run() {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ?? ''
      const weather = await fetchWeather(answers.destination, apiKey)

      try {
        const res = await fetch('/api/generate-packing-list', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, weather }),
        })

        if (!res.ok) throw new Error('API error')
        const packingList: PackingList = await res.json()
        onComplete(weather, packingList)
      } catch {
        onError('Sorry, we could not generate your packing list. Please try again.')
      }
    }

    run()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-200" />
        <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-900">Building your packing list...</p>
        <p className="text-sm text-gray-500 mt-1">Checking the weather and thinking smart</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd app-saily && git -C .. add app-saily/components/loading/LoadingScreen.tsx && git -C .. commit -m "feat: add LoadingScreen with weather + Gemini orchestration"
```

---

## Task 10: Results screen components

**Files:**
- Create: `app-saily/components/results/WeatherSummary.tsx`
- Create: `app-saily/components/results/PackingCategory.tsx`
- Create: `app-saily/components/results/PackingProgress.tsx`
- Create: `app-saily/components/results/ResultsScreen.tsx`

- [ ] **Step 1: Create WeatherSummary.tsx**

Create `app-saily/components/results/WeatherSummary.tsx`:

```typescript
import type { WeatherData } from '@/lib/types'

interface WeatherSummaryProps {
  weather: WeatherData | null
  destination: string
}

export default function WeatherSummary({ weather, destination }: WeatherSummaryProps) {
  if (!weather) {
    return (
      <div className="rounded-2xl bg-gray-100 px-5 py-4 text-center text-gray-500 text-sm">
        Weather data unavailable — packing list based on your preferences only.
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-indigo-50 border border-indigo-100 px-5 py-4 flex items-center gap-3">
      <span className="text-3xl">🌤️</span>
      <div>
        <p className="font-semibold text-gray-900">
          {weather.city} · {weather.temperature}°C
        </p>
        <p className="text-sm text-gray-600 capitalize">{weather.description}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create PackingCategory.tsx**

Create `app-saily/components/results/PackingCategory.tsx`:

```typescript
'use client'

interface PackingCategoryProps {
  emoji: string
  title: string
  items: string[]
  checkedItems: Set<string>
  onToggle: (item: string) => void
}

export default function PackingCategory({
  emoji,
  title,
  items,
  checkedItems,
  onToggle,
}: PackingCategoryProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => {
          const key = `${title}:${item}`
          const checked = checkedItems.has(key)
          return (
            <li key={item}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(key)}
                  className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                />
                <span
                  className={`text-sm transition-colors ${
                    checked ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {item}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

- [ ] **Step 3: Create PackingProgress.tsx**

Create `app-saily/components/results/PackingProgress.tsx`:

```typescript
interface PackingProgressProps {
  packed: number
  total: number
}

export default function PackingProgress({ packed, total }: PackingProgressProps) {
  const pct = total === 0 ? 0 : Math.round((packed / total) * 100)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Packing progress</span>
        <span className="text-sm font-semibold text-indigo-600">
          {packed} of {total} items packed
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create ResultsScreen.tsx**

Create `app-saily/components/results/ResultsScreen.tsx`:

```typescript
'use client'
import { useState, useMemo } from 'react'
import WeatherSummary from './WeatherSummary'
import PackingCategory from './PackingCategory'
import PackingProgress from './PackingProgress'
import type { WeatherData, PackingList } from '@/lib/types'

interface ResultsScreenProps {
  weather: WeatherData | null
  packingList: PackingList
  destination: string
  onStartOver: () => void
}

const CATEGORIES: { key: keyof PackingList; emoji: string; title: string }[] = [
  { key: 'clothes', emoji: '👕', title: 'Clothes' },
  { key: 'toiletries', emoji: '🧴', title: 'Toiletries' },
  { key: 'documents', emoji: '📄', title: 'Documents' },
  { key: 'electronics', emoji: '💻', title: 'Electronics' },
  { key: 'extras', emoji: '🎒', title: 'Extras' },
]

export default function ResultsScreen({
  weather,
  packingList,
  destination,
  onStartOver,
}: ResultsScreenProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const totalItems = useMemo(
    () => CATEGORIES.reduce((sum, cat) => sum + packingList[cat.key].length, 0),
    [packingList]
  )

  function toggle(key: string) {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <WeatherSummary weather={weather} destination={destination} />
      <PackingProgress packed={checkedItems.size} total={totalItems} />
      {CATEGORIES.map((cat) => (
        <PackingCategory
          key={cat.key}
          emoji={cat.emoji}
          title={cat.title}
          items={packingList[cat.key]}
          checkedItems={checkedItems}
          onToggle={toggle}
        />
      ))}
      <button
        onClick={onStartOver}
        className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-indigo-400 hover:text-indigo-600 transition-colors"
      >
        Start over
      </button>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
cd app-saily && git -C .. add app-saily/components/results/ && git -C .. commit -m "feat: add results screen components"
```

---

## Task 11: QuizContainer — state machine

**Files:**
- Create: `app-saily/components/quiz/QuizContainer.tsx`

This is the central orchestrator. It tracks `screen`, `currentStep`, and partial `answers`, and renders the right component.

- [ ] **Step 1: Create QuizContainer.tsx**

Create `app-saily/components/quiz/QuizContainer.tsx`:

```typescript
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
import type { QuizAnswers, WeatherData, PackingList, AppScreen } from '@/lib/types'

type PartialAnswers = Partial<QuizAnswers>

export default function QuizContainer() {
  const [screen, setScreen] = useState<AppScreen>('quiz')
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<PartialAnswers>({})
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [packingList, setPackingList] = useState<PackingList | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleDestination(destination: string, days: number) {
    setAnswers((prev) => ({ ...prev, destination, days }))
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
```

- [ ] **Step 2: Commit**

```bash
cd app-saily && git -C .. add app-saily/components/quiz/QuizContainer.tsx && git -C .. commit -m "feat: add QuizContainer state machine"
```

---

## Task 12: App layout and entry point

**Files:**
- Modify: `app-saily/app/layout.tsx`
- Modify: `app-saily/app/page.tsx`
- Modify: `app-saily/app/globals.css`

- [ ] **Step 1: Update app/layout.tsx**

Replace `app-saily/app/layout.tsx` with:

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Saily — Smart Packing Assistant',
  description: 'Answer 5 questions and get a personalised AI packing list',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Update app/page.tsx**

Replace `app-saily/app/page.tsx` with:

```typescript
import QuizContainer from '@/components/quiz/QuizContainer'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">🧳 Saily</h1>
          <p className="text-gray-500 mt-1 text-sm">Your smart packing assistant</p>
        </div>
        <QuizContainer />
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Update globals.css with Tailwind directives and step animation**

Replace the contents of `app-saily/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes stepIn {
  from {
    opacity: 0;
    transform: translateX(16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.step-animate {
  animation: stepIn 0.25s ease-out;
}
```

- [ ] **Step 4: Commit**

```bash
cd app-saily && git -C .. add app-saily/app/layout.tsx app-saily/app/page.tsx app-saily/app/globals.css && git -C .. commit -m "feat: wire up app layout and entry point"
```

---

## Task 13: Create .env.local and smoke test

**Files:**
- Create: `app-saily/.env.local` (not committed)

- [ ] **Step 1: Create .env.local with real API keys**

Create `app-saily/.env.local` (manually, not via agent — requires real keys):

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=<your-openweathermap-key>
GEMINI_API_KEY=<your-gemini-key>
```

- [ ] **Step 2: Run all tests**

```bash
cd app-saily && npx jest --no-coverage
```

Expected: All tests PASS with no failures.

- [ ] **Step 3: Start dev server**

```bash
cd app-saily && npm run dev
```

Open http://localhost:3000 and verify:
- Step 1 shows city + days inputs
- Steps 2–5 show choice cards with emoji
- Progress bar advances correctly
- Loading screen appears after step 5
- Results show weather summary, categories with checkboxes, progress bar
- Checking items updates the "X of Y" counter
- "Start over" resets to step 1

- [ ] **Step 4: Verify .env.local is gitignored**

```bash
cd app-saily && git -C .. status
```

Confirm `.env.local` does NOT appear in the output.

- [ ] **Step 5: Final commit**

```bash
cd app-saily && git -C .. add app-saily/.env.example && git -C .. commit -m "feat: complete Saily smart packing assistant"
```

---

## Task 14: Submission artifacts

**Files:**
- Create: `submission/how-to-launch.md`

- [ ] **Step 1: Create how-to-launch.md**

Create `submission/how-to-launch.md`:

```markdown
# How to Launch Saily

## Prerequisites
- Node.js 18+
- API keys for OpenWeatherMap and Google Gemini

## Setup

1. Clone the repo
2. Navigate to the app directory:
   ```bash
   cd app-saily
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the env example and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add:
   - `NEXT_PUBLIC_OPENWEATHER_API_KEY` — get a free key at https://openweathermap.org/api
   - `GEMINI_API_KEY` — get a key at https://aistudio.google.com/

5. Start the dev server:
   ```bash
   npm run dev
   ```
6. Open http://localhost:3000
```

- [ ] **Step 2: Commit**

```bash
git add submission/how-to-launch.md && git commit -m "docs: add submission how-to-launch"
```
