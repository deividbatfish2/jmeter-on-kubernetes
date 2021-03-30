import { Router } from 'express'
import { adaptRoute } from '../adapter/adpt-route'
import { makeLoadProjectController } from '../factory/controller/load-project/load-project-controller'

/* eslint-disable @typescript-eslint/no-misused-promises */
export default (router: Router): void => {
  router.post('/load-project', adaptRoute(makeLoadProjectController()))
}
