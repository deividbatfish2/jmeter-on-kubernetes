export interface JmxProvider {
  getProject: (specificFields: any) => Promise<string|Error>
}
