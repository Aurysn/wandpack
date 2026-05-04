import { fetchWeather } from '@/lib/weather'

global.fetch = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
})

const DEPARTURE_DATE = '2099-01-01'

const FORECAST_RESPONSE = {
  city: { name: 'Tokyo', country: 'JP' },
  list: [
    {
      dt: 0,
      dt_txt: '2099-01-01 12:00:00',
      main: { temp: 18.3, temp_min: 15, temp_max: 21 },
      weather: [{ id: 500, description: 'light rain' }],
    },
  ],
}

describe('fetchWeather', () => {
  it('returns weather data on success', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => FORECAST_RESPONSE,
    })

    const result = await fetchWeather('Tokyo', 'test-api-key', DEPARTURE_DATE, 7)

    expect(result).not.toBeNull()
    expect(result?.city).toBe('Tokyo')
    expect(result?.country).toBe('JP')
    expect(result?.tempMin).toBe(15)
    expect(result?.tempMax).toBe(21)
    expect(result?.description).toBe('light rain')
    expect(result?.isForecast).toBe(true)
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('Tokyo'))
  })

  it('returns null when the API request fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false })

    const result = await fetchWeather('Nowhere', 'test-api-key', DEPARTURE_DATE, 7)

    expect(result).toBeNull()
  })

  it('returns null when fetch throws a network error', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const result = await fetchWeather('Somewhere', 'test-api-key', DEPARTURE_DATE, 7)

    expect(result).toBeNull()
  })

  it('returns null when forecast list has no entries in trip window', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        city: { name: 'Fakecity', country: 'XX' },
        list: [],
      }),
    })

    const result = await fetchWeather('Fakecity123', 'test-api-key', DEPARTURE_DATE, 7)

    expect(result).toBeNull()
  })
})
