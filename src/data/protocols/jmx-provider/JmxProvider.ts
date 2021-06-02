export interface JmxProvider {
  getProject: (specificFields: any) => Promise<Error>
}
