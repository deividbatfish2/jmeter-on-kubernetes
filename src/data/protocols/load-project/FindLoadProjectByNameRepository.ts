import { LoadProjectModel } from '../../../domain/models/load-project-model'

export interface FindLoadProjectByNameRepository {
  findLoadProjectByName: (name: string) => Promise<LoadProjectModel>
}
