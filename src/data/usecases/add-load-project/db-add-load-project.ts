import { LoadProjectModel } from '../../../domain/models/load-project-model'
import { AddLoadProject, AddLoadProjectModel } from '../../../domain/usecases/load-project/add-load-project'
import { AddLoadProjectRepository } from '../../protocols/load-project/add-load-project-repository'

export class DbAddLoadProject implements AddLoadProject {
  constructor (private readonly addLoadProjectRepository: AddLoadProjectRepository) {}
  async add (addLoadProject: AddLoadProjectModel): Promise<LoadProjectModel> {
    return await this.addLoadProjectRepository.add(addLoadProject)
  }
}
