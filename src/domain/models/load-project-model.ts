import { Provider } from './jmx-provider'
import { StatusProject } from './status-project'

export interface JmxProvider {
  provider: Provider
  specificFields: any
}

export interface LoadProjectModel {
  id: string
  name: string
  description: string
  status: StatusProject
  jmxProvider: JmxProvider
  command: string
}
