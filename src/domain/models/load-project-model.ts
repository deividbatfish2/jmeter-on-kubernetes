import { JmxProvider } from './jmx-provider'

export interface LoadProjectModel {
  id: string
  name: string
  description: string
  jmxProvider: JmxProvider
  command: string
}
