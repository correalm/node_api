import { InternalError } from '@src/util/errors/internal-error';
import config, { IConfig } from 'config';
import * as HTTPUtil from '@src/util/request';

export interface StormGlassPointSource {
  // dynamic key
  [key: string]: number;
}
export interface StormGlassPoint {
  readonly time: string;
  readonly waveHeight: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}
export interface StormGlassResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  time: string;
  waveHeight: number;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error when trying to comunicate to stormGlass';
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error returned by the stromGlass service';
    super(`${internalMessage}: ${message}`);
  }
}

const stormGlassResourceConfig: IConfig = config.get(
  'App.resources.StormGlass'
);
export class StormGlass {
  /*
    Utilizar o protected me dá um this.request -> não precido de uma variável na classe;
    O construtor obriga a passagem de um axios

    Coloco o readonly para que não possam ser alterados em nenhum lugar
  */

  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  constructor(protected request = new HTTPUtil.Request()) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    try {
      const response = await this.request.get<StormGlassResponse>(
        `${stormGlassResourceConfig.get('apiUrl')}/weather/point?` +
          `lat=${lat}&lng=${lng}` +
          `&params=${this.stormGlassAPIParams}` +
          `&source=${this.stormGlassAPISource}`,
        {
          headers: {
            Authorization: stormGlassResourceConfig.get('apiToken'),
          },
        }
      );

      return this.normalizeResponse(response?.data);
    } catch (err: any) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(err.response.data)} ` +
            `Code: ${err.response.status}`
        );
      }

      throw new ClientRequestError(err.message);
    }
  }

  private normalizeResponse(points: StormGlassResponse): ForecastPoint[] {
    return points.hours
      .filter(this.isValidPoint.bind(this))
      .map(
        ({
          time,
          swellDirection,
          swellHeight,
          swellPeriod,
          waveDirection,
          waveHeight,
          windDirection,
          windSpeed,
        }) => ({
          time: time,
          swellDirection: swellDirection[this.stormGlassAPISource],
          swellHeight: swellHeight[this.stormGlassAPISource],
          swellPeriod: swellPeriod[this.stormGlassAPISource],
          waveDirection: waveDirection[this.stormGlassAPISource],
          waveHeight: waveHeight[this.stormGlassAPISource],
          windDirection: windDirection[this.stormGlassAPISource],
          windSpeed: windSpeed[this.stormGlassAPISource],
        })
      );
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}
