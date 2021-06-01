import { Provider } from '../../../domain/models/jmx-provider'
import { JmxProvider } from './JmxProvider'

export interface JmxProviderFactory {
  getJmxProvider: (provider: Provider) => JmxProvider
}
