import { Beach, BeachPosition } from 'src/models/beach';
import nock from 'nock'
import stormGlassResponse from '../fixtures/stormglass_weather_2_hours.json'
import apiForecastResponse from '../fixtures/api_forecast_response_2_hours.json'

describe('Beach forecast tests', () => {
  beforeEach(async() => {
    await Beach.deleteMany({});

    const beach = new Beach({
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
    })

    await beach.save()
  })

  it('should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true
      }
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng:'151.289824',
        params: /(.*)/,
        source:'noaa'
      })
      .reply(200, stormGlassResponse);

    const { body, status } = await global.testRequest.get('/forecast');
    expect(status).toBe(200);

    expect(body).toEqual(apiForecastResponse);
  });

  it('should return 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true
      }
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({ lat: '-33.792726', lng:'151.289824' })
      .replyWithError('Something went wrong')
    
    const { status } = await global.testRequest.get('/forecast')

    expect(status).toBe(500);
  })
});
