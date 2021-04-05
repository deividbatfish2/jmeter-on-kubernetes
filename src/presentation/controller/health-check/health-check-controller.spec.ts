import { DateHelper } from '../../utils/date/date-helper-protocol'
import { ok } from '../../utils/http-responses'
import { HealthCheckController } from './health-check-controller'

const makeDateHelperStub = (): DateHelper => {
  class DateHelperStub implements DateHelper {
    now (): number {
      return 1617664390886
    }
  }
  return new DateHelperStub()
}

interface SutTypes {
  sut: HealthCheckController
  dateHelperStub: DateHelper
}

const makeSut = (): SutTypes => {
  const dateHelperStub = makeDateHelperStub()
  const sut = new HealthCheckController(dateHelperStub)
  return {
    sut, dateHelperStub
  }
}

describe('Health Check Controller', () => {
  describe('Success', () => {
    test('Should return 200 on success', async () => {
      const { sut } = makeSut()
      const result = await sut.handle({})
      expect(result).toStrictEqual(ok({ timestamp: 1617664390886 }))
    })
  })
})
