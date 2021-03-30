import request from 'supertest'
import { Collections } from '../../infra/db/mongo/helpers/collections'
import { MongoHelper } from '../../infra/db/mongo/helpers/mongo-helper'
import app from '../config/app'

describe('Load Project routes', () => {
  let loadProjectCollection
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
  describe('POST /api/load-projec', () => {
    test('Should create a load project', async () => {
      await request(app)
        .post('/api/load-project')
        .send({
          name: 'Any Name',
          description: 'Any Description',
          jmxProvider: {
            provider: 'git',
            specificFields: {
              path: 'any_path'
            }
          },
          command: 'any command'
        })
        .expect(201)
    })
  })
})
