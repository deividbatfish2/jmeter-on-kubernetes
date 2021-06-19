import { AddLoadProjectRepository } from '../../../../data/protocols/load-project/add-load-project-repository'
import { FindLoadProjectByIdRepository } from '../../../../data/protocols/load-project/find-load-project-by-id-repository'
import { FindLoadProjectByNameRepository } from '../../../../data/protocols/load-project/find-load-project-by-name-repository'
import { UpdateLoadProjecStatusModel, UpdateLoadProjectStatusRepository } from '../../../../data/protocols/load-project/update-load-project-status-repository'
import { ProjectCanNotBeUpdatedError } from '../../../../domain/error/project-can-not-be-updated'
import { LoadProjectModel } from '../../../../domain/models/load-project-model'
import { AddLoadProjectModel } from '../../../../domain/usecases/load-project/add-load-project'
import { Collections } from '../helpers/collections'
import { MongoHelper } from '../helpers/mongo-helper'

export class LoadProjectMongoRepository implements AddLoadProjectRepository,
  FindLoadProjectByNameRepository,
  FindLoadProjectByIdRepository,
  UpdateLoadProjectStatusRepository {

  async findLoadProjectByName(name: string): Promise<LoadProjectModel> {
    const loadProjectCollection = await MongoHelper.getCollection(Collections.loadProject)
    const loadProject = await loadProjectCollection.findOne({ name })
    return MongoHelper.map<LoadProjectModel>(loadProject)
  }

  async add(addLoadProject: AddLoadProjectModel): Promise<LoadProjectModel> {
    const loadProjectCollection = await MongoHelper.getCollection(Collections.loadProject)
    const { ops: [loadProject] } = await loadProjectCollection.insertOne(addLoadProject)
    return MongoHelper.map<LoadProjectModel>(loadProject)
  }

  async findLoadProjectById(idProject: string): Promise<LoadProjectModel> {
    const loadProjectCollection = await MongoHelper.getCollection(Collections.loadProject)
    const loadProject = await loadProjectCollection.findOne({ _id: idProject })
    return MongoHelper.map<LoadProjectModel>(loadProject)
  }

  async updateStatus(updateStatusModel: UpdateLoadProjecStatusModel): Promise<void | Error> {
    const loadProjectCollection = await MongoHelper.getCollection(Collections.loadProject)
    const { id, status } = updateStatusModel
    const loadProjectUpdate = await loadProjectCollection.updateOne({ _id: id }, { $set: { status } })
    if (loadProjectUpdate.modifiedCount === 0) {
      return new ProjectCanNotBeUpdatedError(id)
    }
  }
}
