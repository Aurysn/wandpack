# How to Launch Tripalis Packendo

## Prerequisites

- Node.js 18+ and npm
- An [OpenWeatherMap](https://openweathermap.org/api) API key (free tier works)
- A [Google Gemini](https://aistudio.google.com/app/apikey) API key (free tier works)

## Setup

```bash
cd app-saily
npm install
```

Create a file named `.env.local` inside `app-saily/` with your API keys:

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweathermap_key_here
GEMINI_API_KEY=your_gemini_key_here
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Run Tests

```bash
npm test
```

All 11 tests should pass.

## How It Works

1. Answer 5 questions: destination, trip length, baggage type, trip type, packing style, and temperature preference
2. The app fetches live weather for your destination via OpenWeatherMap
3. Gemini generates a personalised packing list based on your answers and the weather
4. Check items off as you pack — progress is tracked in real time
5. Hit **Start over** to plan your next trip
