import { LoadProjectModel } from '../../../domain/models/load-project-model'

export interface FindLoadProjectByIdRepository {
  findLoadProjectById: (idProject: string) => Promise<LoadProjectModel>
}
