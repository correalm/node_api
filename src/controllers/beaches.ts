import { Controller, Get, Post } from '@overnightjs/core';
import { Beach } from '../models/beach';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

@Controller('beaches')
export class BeachesController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach(req.body)

      const result = await beach.save()

      res.status(201).send(result)
    } catch (error: any) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(422).send({ error: error.message })
      } else {
        res.status(500).send({ error: 'Internal server error' })
      }
    }
  }

  @Get('')
  public async getLoggedUserBeaches(_: Request, res: Response): Promise<void> {
    try {
      const beaches = await Beach.find({})

      res.status(200).send(beaches)
    } catch (error) {
      console.error(error)
      res.status(500).send({ error: 'Internal server error' })
    }
  }
}
