export class ProjectCanNotBeUpdatedError extends Error {
  constructor(projectId: string) {
    super(`The ${projectId} project can't be updated`)
    this.name = 'ProjectCanNotBeUpdatedError'
  }
}
