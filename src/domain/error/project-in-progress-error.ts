export class ProjectInProgressError extends Error {
  constructor (projectId: string) {
    super(`The ${projectId} project already in progess`)
    this.name = 'ProjectInProgressError'
  }
}
