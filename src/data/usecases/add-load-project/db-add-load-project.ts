import { LoadProjectModel } from '../../../domain/models/load-project-model'
import { AddLoadProject, AddLoadProjectModel } from '../../../domain/usecases/load-project/add-load-project'
import { AddLoadProjectRepository } from '../../protocols/load-project/add-load-project-repository'
import { FindLoadProjectByNameRepository } from '../../protocols/load-project/FindLoadProjectByNameRepository'

export class DbAddLoadProject implements AddLoadProject {
  constructor (
    private readonly addLoadProjectRepository: AddLoadProjectRepository,
    private readonly findLoadProjectByNameRepository: FindLoadProjectByNameRepository
  ) {}

  async add (addLoadProject: AddLoadProjectModel): Promise<LoadProjectModel> {
    await this.findLoadProjectByNameRepository.findLoadProjectByName(addLoadProject.name)
    return await this.addLoadProjectRepository.add(addLoadProject)
  }
}
