import { LoadProjectController } from "./load-project-controller"

describe('LoadProjectController', () => {
  test('Should return 400 if name is not provided', async () => {
    const sut = new LoadProjectController()
    const result = await sut.handle({ description: 'any_description' })
    expect(result.statusCode).toBe(400)
  })
})
