import { fetchWeather } from '@/lib/weather'

global.fetch = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
})

// A departure date well beyond 5 days forces the current-weather path in all tests
const FAR_DATE = '2099-01-01'

describe('fetchWeather', () => {
  it('returns weather data on success', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: 'Tokyo',
        sys: { country: 'JP' },
        main: { temp: 18.3, temp_min: 15, temp_max: 21 },
        weather: [{ description: 'light rain' }],
      }),
    })

    const result = await fetchWeather('Tokyo', 'test-api-key', FAR_DATE, 7)

    expect(result).toEqual({
      city: 'Tokyo',
      country: 'JP',
      temperature: 18,
      tempMin: 15,
      tempMax: 21,
      description: 'light rain',
      isForecast: false,
    })
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('Tokyo'))
  })

  it('returns null when the API request fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false })

    const result = await fetchWeather('Nowhere', 'test-api-key', FAR_DATE, 7)

    expect(result).toBeNull()
  })

  it('returns null when fetch throws a network error', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const result = await fetchWeather('Somewhere', 'test-api-key', FAR_DATE, 7)

    expect(result).toBeNull()
  })

  it('returns null when API responds 200 with an error body', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cod: '404', message: 'city not found' }),
    })
    const result = await fetchWeather('Fakecity123', 'test-api-key', FAR_DATE, 7)
    expect(result).toBeNull()
  })
})
