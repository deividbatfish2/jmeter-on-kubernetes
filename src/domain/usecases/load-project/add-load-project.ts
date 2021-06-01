import { JmxProviderModel, LoadProjectModel } from '../../models/load-project-model'
import { StatusProject } from '../../models/status-project'

export interface AddLoadProjectModel {
  name: string
  description: string
  jmxProvider: JmxProviderModel
  command: string
  status?: StatusProject
}

export interface AddLoadProject {
  add: (addLoadProject: AddLoadProjectModel) => Promise<LoadProjectModel>
}
