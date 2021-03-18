import { LoadProjectController } from './load-project-controller'

describe('LoadProjectController', () => {
  test('should return 400 if name is not provided', async () => {
    const sut = new LoadProjectController()
    const result = await sut.handle({ body: { description: 'Any description' } })
    expect(result.statusCode).toBe(400)
  })

  test('should return 400 if description is not provided', async () => {
    const sut = new LoadProjectController()
    const result = await sut.handle({ body: { name: 'Any Name' } })
    expect(result.statusCode).toBe(400)
  })

  test('should return 400 if jmxProvider is not provided', async () => {
    const sut = new LoadProjectController()
    const result = await sut.handle({ body: { name: 'Any Name', description: 'Any description' } })
    expect(result.statusCode).toBe(400)
  })

  test('should return 201 if all required fields are informed', async () => {
    const sut = new LoadProjectController()
    const result = await sut.handle({ body: { name: 'Any Name', description: 'Any description', jmxProvider: 'any_provider' } })
    expect(result.statusCode).toBe(201)
  })
})
