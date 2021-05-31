export class ProjectNotFindedError extends Error {
  constructor (projectId: string) {
    super(`Project ${projectId} not finded`)
    this.name = 'ProjectNotFindedError'
  }
}
