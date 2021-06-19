import { Collection } from 'mongodb'
import { ProjectCanNotBeUpdatedError } from '../../../../domain/error/project-can-not-be-updated'
import { Provider } from '../../../../domain/models/jmx-provider'
import { StatusProject } from '../../../../domain/models/status-project'
import { AddLoadProjectModel } from '../../../../domain/usecases/load-project/add-load-project'
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
  command: 'any command',
  status: StatusProject.STOPED
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

  describe('AddLoadProjectRepository', () => {
    test('Should return a load project on add success', async () => {
      const sut = new LoadProjectMongoRepository()
      const result = await sut.add(makeFakeAddLoadProjectModel())
      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
      expect(result).toMatchObject(makeFakeAddLoadProjectModel())
    })
  })

  describe('FindLoadProjectByNameRepository', () => {
    test('Should find and retunr a load project by a name', async () => {
      const sut = new LoadProjectMongoRepository()
      await loadProjectCollection.save(makeFakeAddLoadProjectModel())

      const result = await sut.findLoadProjectByName(makeFakeAddLoadProjectModel().name)
      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
      expect(result).toMatchObject(makeFakeAddLoadProjectModel())
    })
  })

  describe('FindLoadProjectByIdRepository', () => {
    test('Should find and retunr a load project by id', async () => {
      const sut = new LoadProjectMongoRepository()
      const project = await loadProjectCollection.save(makeFakeAddLoadProjectModel())

      const result = await sut.findLoadProjectById(project.ops[0]._id)

      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
      expect(result).toMatchObject(makeFakeAddLoadProjectModel())
    })
  })

  describe('UpdateLoadProjectStatusRepository', () => {
    test('Should update status of a load project finded by the id', async () => {
      const sut = new LoadProjectMongoRepository()
      const project = await loadProjectCollection.save(makeFakeAddLoadProjectModel())

      await sut.updateStatus({ id: project.ops[0]._id, status: StatusProject.RUNNING })

      const result = await loadProjectCollection.findOne({ _id: project.ops[0]._id })
      
      expect(result).toBeTruthy()
      expect(result).toMatchObject({ ...makeFakeAddLoadProjectModel(), ...{ status: StatusProject.RUNNING } })
    })

    test('Should return a ProjectCanNotBeUpdatedError if project not exists', async () => {
      const sut = new LoadProjectMongoRepository()
      const result = await sut.updateStatus({ id: 'any_id', status: StatusProject.RUNNING })

      expect(result).toStrictEqual(new ProjectCanNotBeUpdatedError('any_id'))
    })
  })
})
