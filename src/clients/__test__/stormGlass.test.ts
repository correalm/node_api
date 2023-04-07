import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios'
import stormGlassNotNormaliezedWeather from '@test/fixtures/stormglass_weather_3_hours.json'
import stormGlassNormalizedWeather from '@test/fixtures/stormglass_normalized_weather_3_hours.json'

jest.mock('axios')

describe('StormGlass client', () => {
  test('return the normalizad forecast from the StormGlass service', async () => {
    const lat = -33.123
    const lng = 134.567

    axios.get = jest.fn().mockResolvedValue({ data: stormGlassNotNormaliezedWeather })

    const stormGlass = new StormGlass(axios)
    const response = await stormGlass.fetchPoints(lat, lng)
    expect(response).toEqual(stormGlassNormalizedWeather)
  })
})