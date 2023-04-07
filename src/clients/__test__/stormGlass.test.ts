import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassNotNormaliezedWeather from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalizedWeather from '@test/fixtures/stormglass_normalized_weather_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  test('return the normalizad forecast from the StormGlass service', async () => {
    const lat = -33.123;
    const lng = 134.567;

    mockedAxios.get.mockResolvedValue({
      data: stormGlassNotNormaliezedWeather,
    });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalizedWeather);
  });

  test('exclude incomplete data points', async () => {
    const lat = -33.123;
    const lng = 134.567;
    const incompletResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-01-01T00:00-00:00',
        },
      ],
    };

    mockedAxios.get.mockResolvedValue({ data: incompletResponse });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual([]);
  });

  test('return a generic error from stormGlass service when the request fail before reacing the service', async () => {
    const lat = -33.123;
    const lng = 134.567;

    mockedAxios.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockedAxios);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to comunicate to stormGlass: Network Error'
    );
  });

  test('return a generic error from stormGlass service when the request fail before reacing the service', async () => {
    const lat = -33.123;
    const lng = 134.567;

    mockedAxios.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate limit reached'] },
      },
    });

    const stormGlass = new StormGlass(mockedAxios);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the stromGlass service: Error: {"errors":["Rate limit reached"]} Code: 429'
    );
  });
});
