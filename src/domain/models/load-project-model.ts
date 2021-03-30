import { Provider } from './jmx-provider'

export interface JmxProvider {
  provider: Provider
  specificFields: any
}

export interface LoadProjectModel {
  id: string
  name: string
  description: string
  jmxProvider: JmxProvider
  command: string
}
