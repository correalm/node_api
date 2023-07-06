import { StormGlass } from '@src/clients/stormGlass';
import stormGlassNormalizedResponse from '@test/fixtures/stormglass_normalized_weather_2_hours.json';
import {
  Forecast,
  ForecastProcessingInternalError,
} from '../forecast';
import { BeachI, BeachPosition } from '@src/models/beach'
import apiForecastResponse from '../../../test/fixtures/api_forecast_response_2_hours.json'

jest.mock('@src/clients/stormGlass');

describe('Forecast Service', () => {
  // this permits types on mocked element
  const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;
  test('return the forecast for a list of beaches', async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponse
    );

    const beaches: BeachI[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-user',
      },
    ];

    const forecast = new Forecast(mockedStormGlassService);
    const beachsWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachsWithRating).toEqual(apiForecastResponse);
  });

  test('return a empty list when the beaches array is empty', async () => {
    const forecast = new Forecast();
    const response = await forecast.processForecastForBeaches([]);

    expect(response).toEqual([]);
  });

  test('throw internal processing error when something goes wrong during the rating process', async () => {
    const beaches: BeachI[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-user',
      },
    ];

    mockedStormGlassService.fetchPoints.mockRejectedValue(
      'Error fetching data'
    );

    const forecast = new Forecast(mockedStormGlassService);
    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(
      ForecastProcessingInternalError
    );
  });
});
