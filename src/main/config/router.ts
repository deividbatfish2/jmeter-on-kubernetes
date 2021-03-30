import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api/', router)

  readdirSync(join(__dirname, '../routes'), 'utf-8')
    .filter(file => file.includes('routes') && !file.includes('test') && !file.includes('map'))
    .map(async file => (await import(`../routes/${file}`)).default(router))
}
