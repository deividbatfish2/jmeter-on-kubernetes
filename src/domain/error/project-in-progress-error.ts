export class ProjectInProgressError extends Error {
  constructor (projectId: string) {
    super(`TRhe ${projectId} project already in progess`)
    this.name = 'ProjectInProgressError'
  }
}
