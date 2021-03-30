import express from 'express'
import setUpRrouter from './router'
import setUpMiddleware from './middleware'

const app = express()

setUpMiddleware(app)
setUpRrouter(app)

export default app
