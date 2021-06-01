import { Provider } from './jmx-provider'
import { StatusProject } from './status-project'

export interface JmxProviderModel {
  provider: Provider
  specificFields: any
}

export interface LoadProjectModel {
  id: string
  name: string
  description: string
  status: StatusProject
  jmxProvider: JmxProviderModel
  command: string
}
