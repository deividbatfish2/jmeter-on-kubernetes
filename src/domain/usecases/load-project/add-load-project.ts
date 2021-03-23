import { JmxProvider } from '../../models/jmx-provider'
import { LoadProjectModel } from '../../models/load-project-model'

export interface AddLoadProjectModel {
  name: string
  description: string
  jmxProvider: JmxProvider
  command: string
}

export interface AddLoadProject {
  add: (addLoadProject: AddLoadProjectModel) => Promise<LoadProjectModel>
}
