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

  it('returns null when API responds 200 with an error body', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cod: '404', message: 'city not found' }),
    })
    const result = await fetchWeather('Fakecity123', 'test-api-key')
    expect(result).toBeNull()
  })
})
