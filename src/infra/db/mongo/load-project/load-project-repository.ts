import { AddLoadProjectRepository } from '../../../../db/protocols/load-project/add-load-project-repository'
import { LoadProjectModel } from '../../../../domain/models/load-project-model'
import { AddLoadProjectModel } from '../../../../presentation/controller/load-project-controller-protocols'
import { Collections } from '../helpers/collections'
import { MongoHelper } from '../helpers/mongo-helper'

export class LoadProjectMongoRepository implements AddLoadProjectRepository {
  async add (addLoadProject: AddLoadProjectModel): Promise<LoadProjectModel> {
    const loadProjectCollection = await MongoHelper.getCollection(Collections.loadProject)
    const { ops: [loadProject] } = await loadProjectCollection.insertOne(addLoadProject)
    return MongoHelper.map<LoadProjectModel>(loadProject)
  }
}
