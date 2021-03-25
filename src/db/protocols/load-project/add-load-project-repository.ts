import { AddLoadProjectModel } from '../../../domain/usecases/load-project/add-load-project'
import { LoadProjectModel } from '../../../domain/models/load-project-model'

export interface AddLoadProjectRepository {
  add: (addLoadProject: AddLoadProjectModel) => Promise<LoadProjectModel>
}
