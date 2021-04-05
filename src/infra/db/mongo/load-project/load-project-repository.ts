import { AddLoadProjectRepository } from '../../../../data/protocols/load-project/add-load-project-repository'
import { FindLoadProjectByNameRepository } from '../../../../data/protocols/load-project/FindLoadProjectByNameRepository'
import { LoadProjectModel } from '../../../../domain/models/load-project-model'
import { AddLoadProjectModel } from '../../../../domain/usecases/load-project/add-load-project'
import { Collections } from '../helpers/collections'
import { MongoHelper } from '../helpers/mongo-helper'

export class LoadProjectMongoRepository implements AddLoadProjectRepository, FindLoadProjectByNameRepository {
  async findLoadProjectByName (name: string): Promise<LoadProjectModel> {
    const loadProjectCollection = await MongoHelper.getCollection(Collections.loadProject)
    const loadProject = await loadProjectCollection.findOne({ name })
    return MongoHelper.map<LoadProjectModel>(loadProject)
  }

  async add (addLoadProject: AddLoadProjectModel): Promise<LoadProjectModel> {
    const loadProjectCollection = await MongoHelper.getCollection(Collections.loadProject)
    const { ops: [loadProject] } = await loadProjectCollection.insertOne(addLoadProject)
    return MongoHelper.map<LoadProjectModel>(loadProject)
  }
}
