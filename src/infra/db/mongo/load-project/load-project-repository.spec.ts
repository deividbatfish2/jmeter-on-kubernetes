import { Collection } from 'mongodb'
import { AddLoadProjectModel, Provider } from '../../../../presentation/controller/load-project-controller-protocols'
import { Collections } from '../helpers/collections'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadProjectMongoRepository } from './load-project-repository'

const makeFakeAddLoadProjectModel = (): AddLoadProjectModel => ({
  name: 'Any Name',
  description: 'Any Description',
  jmxProvider: {
    provider: Provider.GIT,
    specificFields: {
      path: 'any_path'
    }
  },
  command: 'any command'
})
describe('LoadProjectMongoRepository', () => {
  let loadProjectCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    loadProjectCollection = await MongoHelper.getCollection(Collections.loadProject)
    await loadProjectCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('Should return a load project on add success', async () => {
    const sut = new LoadProjectMongoRepository()
    const result = await sut.add(makeFakeAddLoadProjectModel())
    expect(result).toBeTruthy()
    expect(result.id).toBeTruthy()
    expect(result).toMatchObject(makeFakeAddLoadProjectModel())
  })
})
