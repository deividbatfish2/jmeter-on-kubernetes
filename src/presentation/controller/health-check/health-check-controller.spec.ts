import { IDateHelper } from '../../utils/date/date-helper-protocol'
import { ok, serverError } from '../../utils/http-responses'
import { HealthCheckController } from './health-check-controller'

const makeDateHelperStub = (): IDateHelper => {
  class DateHelperStub implements IDateHelper {
    now (): number {
      return 1617664390886
    }
  }
  return new DateHelperStub()
}

interface SutTypes {
  sut: HealthCheckController
  dateHelperStub: IDateHelper
}

const makeSut = (): SutTypes => {
  const dateHelperStub = makeDateHelperStub()
  const sut = new HealthCheckController(dateHelperStub)
  return {
    sut, dateHelperStub
  }
}

describe('Health Check Controller', () => {
  describe('DataHelper', () => {
    test('Should call DateHelper', async () => {
      const { sut, dateHelperStub } = makeSut()
      const nowSpy = jest.spyOn(dateHelperStub, 'now')

      await sut.handle({})

      expect(nowSpy).toBeCalledTimes(1)
    })

    test('Should return 500 if DateHelper throws', async () => {
      const { sut, dateHelperStub } = makeSut()
      jest.spyOn(dateHelperStub, 'now')
        .mockImplementationOnce(() => { throw new Error() })

      const result = await sut.handle({})

      expect(result).toStrictEqual(serverError())
    })
  })
  describe('Success', () => {
    test('Should return 200 on success', async () => {
      const { sut } = makeSut()
      const result = await sut.handle({})
      expect(result).toStrictEqual(ok({ timestamp: 1617664390886 }))
    })
  })
})
