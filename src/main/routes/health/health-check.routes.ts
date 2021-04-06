import { Router } from 'express'
import { adaptRoute } from '../../adapter/adpt-route'
import { makeHealthCheckController } from '../../factory/controller/health-check/health-check-controller'

/* eslint-disable @typescript-eslint/no-misused-promises */
export default (router: Router): void => {
  router.get('/health-check', adaptRoute(makeHealthCheckController()))
}
