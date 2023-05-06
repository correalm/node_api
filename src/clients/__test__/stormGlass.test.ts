import { StormGlass } from '@src/clients/stormGlass';
import * as HTTPUtil from '@src/util/request';
import stormGlassNotNormaliezedWeather from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalizedWeather from '@test/fixtures/stormglass_normalized_weather_3_hours.json';

jest.mock('@src/util/request');

describe('StormGlass client', () => {
  const mockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  test('return the normalizad forecast from the StormGlass service', async () => {
    const lat = -33.123;
    const lng = 134.567;

    mockedRequest.get.mockResolvedValue({
      data: stormGlassNotNormaliezedWeather,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
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

    mockedRequest.get.mockResolvedValue({
      data: incompletResponse,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual([]);
  });

  test('return a generic error from stormGlass service when the request fail before reacing the service', async () => {
    const lat = -33.123;
    const lng = 134.567;

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to comunicate to stormGlass: Network Error'
    );
  });

  test('return a generic error from stormGlass service when the request fail before reacing the service', async () => {
    const lat = -33.123;
    const lng = 134.567;

    mockedRequestClass.isRequestError.mockReturnValue(true);
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate limit reached'] },
      },
    });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the stromGlass service: Error: {"errors":["Rate limit reached"]} Code: 429'
    );
  });
});
