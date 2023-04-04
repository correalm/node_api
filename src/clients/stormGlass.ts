import { AxiosStatic } from 'axios';

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
    return this.request.get(
      'https://api.stormglass.io/v2/weather/point?' +
      `lat=${lat}&lng=${lng}` +
      `&params=${this.stormGlassAPIParams}` +
      `&source=${this.stormGlassAPISource}`
    )
  }
}