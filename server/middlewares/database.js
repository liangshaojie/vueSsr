import mongoose from 'mongoose'
import config from '../config'
import {resolve} from 'path'
import fs from 'fs'

const models = resolve(__dirname, '../database/schema')

fs.readdirSync(models)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(resolve(models, file)))

export const database = app => {
  mongoose.set('debug', true)
  mongoose.connect(config.db)

  mongoose.connection.on('disconnected', () => {
    console.log('mongodb disconnected!', config.db);
  });

  mongoose.connection.on('error', err => {
    console.error(err)
  });

  mongoose.connection.on('open', async () => {
    console.log('connection to mongodb success', config.db);
  });

}