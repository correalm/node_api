import { AxiosStatic } from 'axios';

export interface StormGlassPointSource {
  // dynamic key
  [key: string]: number
}
export interface StormGlassPoint {
  readonly time:           string;
  readonly waveHeight:     StormGlassPointSource;
  readonly waveDirection:  StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight:    StormGlassPointSource;
  readonly swellPeriod:    StormGlassPointSource;
  readonly windDirection:  StormGlassPointSource;
  readonly windSpeed:      StormGlassPointSource;
}
export interface StormGlassResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  time:           string,
  waveHeight:     number;
  waveDirection:  number;
  swellDirection: number;
  swellHeight:    number;
  swellPeriod:    number;
  windDirection:  number;
  windSpeed:      number;
}

export class StormGlass {
  /*
    Utilizar o protected me dá um this.request -> não precido de uma variável na classe;
    O construtor obriga a passagem de um axios

    Coloco o readonly para que não possam ser alterados em nenhum lugar
  */

  readonly stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  constructor( protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<{}> {
    const response =  this.request.get<StormGlassResponse>(
      'https://api.stormglass.io/v2/weather/point?' +
      `lat=${lat}&lng=${lng}` +
      `&params=${this.stormGlassAPIParams}` +
      `&source=${this.stormGlassAPISource}`
    )
  }

  private normalizeResponse(points: StormGlassResponse): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map(point => ({}))
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPIParams] &&
      point.waveDirection?.[this.stormGlassAPIParams] &&
      point.waveHeight?.[this.stormGlassAPIParams] &&
      point.windDirection?.[this.stormGlassAPIParams] &&
      point.windSpeed?.[this.stormGlassAPIParams] &&
  )
  }
}