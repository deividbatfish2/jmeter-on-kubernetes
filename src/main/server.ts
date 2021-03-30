import { MongoHelper } from '../infra/db/mongo/helpers/mongo-helper'
import app from './config/app'
import env from './config/env'

/* eslint-disable @typescript-eslint/no-misused-promises */
app.listen(env.app.port, async () => {
  await MongoHelper.connect(env.db.mongoUrl)
  console.log(`Running on ${env.app.port}`)
})
