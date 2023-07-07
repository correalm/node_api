// express
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';

// controllers
import { BeachesController } from './controllers/beaches';
import { ForecastController } from './controllers/forecast';

// database
import * as db from './database';

import './util/module-alias';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async start(): Promise<void> {
    this.app.listen(this.port, () => {
      console.info('Server listening on port: ', this.port)
    })
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();

    this.addControllers([forecastController, beachesController]);
  }

  private async databaseSetup(): Promise<void> {
    await db.connect();
  }

  public async close(): Promise<void> {
    await db.close();
  }

  public getApp(): Application {
    return this.app;
  }
}
