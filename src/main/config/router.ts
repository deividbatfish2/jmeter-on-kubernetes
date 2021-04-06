import { Express, Router } from 'express'
import { readdirSync, lstatSync } from 'fs'
import { join, resolve } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api/', router)

  readdirSync(join(__dirname, '../routes'), 'utf-8')
    .map(file => resolve(__dirname, '../routes', file))
    .map(joinPath)
    .reduce((acc: any[], current: any[]) => acc.concat(...current), [])
    .filter((file: string) => file.includes('routes') && !file.includes('test') && !file.includes('map'))
    .map(async (file: string) => (await import(`${file}`)).default(router))
}

const joinPath = (path: string): any => {
  if (!lstatSync(path).isDirectory()) {
    return path
  } else {
    return readdirSync(path, 'utf-8')
      .map(file => resolve(path, file))
      .map(joinPath)
  }
}
