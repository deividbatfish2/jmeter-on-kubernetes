import { DbAddLoadProject } from '../../../../data/usecases/add-load-project/db-add-load-project'
import { LoadProjectMongoRepository } from '../../../../infra/db/mongo/load-project/load-project-repository'
import { LoadProjectController } from '../../../../presentation/controller/load-project/load-project-controller'
import { Controller } from '../../../../presentation/protocols/controller'

export const makeLoadProjectController = (): Controller => {
  const loadProjectMongoRepository = new LoadProjectMongoRepository()
  const dbAddLoadProject = new DbAddLoadProject(loadProjectMongoRepository, loadProjectMongoRepository)
  return new LoadProjectController(dbAddLoadProject)
}
