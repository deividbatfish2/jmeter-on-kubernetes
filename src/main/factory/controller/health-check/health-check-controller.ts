import { HealthCheckController } from '../../../../presentation/controller/health-check/health-check-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeDateHelper } from '../../utils/date/date-helper'

export const makeHealthCheckController = (): Controller => {
  const healthCheckController = new HealthCheckController(makeDateHelper())
  return healthCheckController
}
