import { DateHelper } from '../../utils/date/date-helper-protocol'
import { ok } from '../../utils/http-responses'
import { HealthCheckController } from './health-check-controller'

describe('Health Check Controller', () => {
  test('Should return 200 on success', async () => {
    class DateHelperStub implements DateHelper {
      now (): number {
        return 1617664390886
      }
    }
    const dateHelperStub = new DateHelperStub()
    const sut = new HealthCheckController(dateHelperStub)
    const result = await sut.handle({})
    expect(result).toStrictEqual(ok({ timestamp: 1617664390886 }))
  })
})
