import { LoadProjectController } from './load-project-controller'

const makeFakeRequest = (): any => ({
  body: { name: 'Any Name', description: 'Any description', jmxProvider: 'any_provider' }
})

const makeSut = (): LoadProjectController => {
  return new LoadProjectController()
}

describe('LoadProjectController', () => {
  test('should return 400 if name is not provided', async () => {
    const sut = makeSut()
    const { body: name, ...requestWithoutName } = makeFakeRequest()
    const result = await sut.handle({ body: requestWithoutName })
    expect(result.statusCode).toBe(400)
  })

  test('should return 400 if description is not provided', async () => {
    const sut = makeSut()
    const { body: description, ...requestWithoutDescription } = makeFakeRequest()
    const result = await sut.handle({ body: requestWithoutDescription })
    expect(result.statusCode).toBe(400)
  })

  test('should return 400 if jmxProvider is not provided', async () => {
    const sut = makeSut()
    const { body: jmxProvider, ...requestWithoutJmxProvider } = makeFakeRequest()
    const result = await sut.handle({ body: requestWithoutJmxProvider })
    expect(result.statusCode).toBe(400)
  })

  test('should return 201 if all required fields are informed', async () => {
    const sut = makeSut()
    const result = await sut.handle(makeFakeRequest())
    expect(result.statusCode).toBe(201)
  })
})
