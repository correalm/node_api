import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import { InternalError } from '@src/util/errors/internal-error';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpect error in forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    const pointsWithCorrectSource: BeachForecast[] = [];

    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = this.enrichedBeach(points, beach);

        pointsWithCorrectSource.push(...enrichedBeachData);
      }
    } catch (error: any) {
      throw new ForecastProcessingInternalError(error.message);
    }

    return this.mapForecastByTime(pointsWithCorrectSource);
  }

  private enrichedBeach(
    points: ForecastPoint[],
    beach: Beach
  ): BeachForecast[] {
    return points.map((point) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...point,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = forecast.reduce(
      (timeForecasts: TimeForecast[], point) => {
        const timePoint = timeForecasts.find(({ time }) => time === point.time);

        if (timePoint) {
          timePoint.forecast.push(point);
        } else {
          timeForecasts.push({
            time: point.time,
            forecast: [point],
          });
        }

        return timeForecasts;
      },
      []
    );

    return forecastByTime;
  }
}
