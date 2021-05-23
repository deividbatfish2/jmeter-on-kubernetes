import { RunLoadProject, RunLoadProjectModel } from '../../../domain/usecases/load-project/run-load-project'
import { FindLoadProjectByIdRepository } from '../../protocols/load-project/find-load-project-by-id-repository'

export class DbRunLoadProject implements RunLoadProject {
  constructor (
    private readonly findLoadProjectByIdRepository: FindLoadProjectByIdRepository
  ) {}

  async run (runLoadProjectModel: RunLoadProjectModel): Promise<Error> {
    await this.findLoadProjectByIdRepository.findLoadProjectById(runLoadProjectModel.idProject)
    return null
  }
}
