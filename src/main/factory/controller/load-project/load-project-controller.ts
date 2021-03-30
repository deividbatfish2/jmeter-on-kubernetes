import { DbAddLoadProject } from '../../../../db/usecases/add-load-project/db-add-load-project'
import { LoadProjectMongoRepository } from '../../../../infra/db/mongo/load-project/load-project-repository'
import { LoadProjectController } from '../../../../presentation/controller/load-project-controller'
import { Controller } from '../../../../presentation/protocols/controller'

export const makeLoadProjectController = (): Controller => {
  const loadProjectMongoRepository = new LoadProjectMongoRepository()
  const dbAddLoadProject = new DbAddLoadProject(loadProjectMongoRepository)
  return new LoadProjectController(dbAddLoadProject)
}
