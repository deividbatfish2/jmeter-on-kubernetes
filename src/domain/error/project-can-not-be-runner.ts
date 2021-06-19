export class ProjectCanNotBeRunnerError extends Error {
  constructor(projectId: string) {
    super(`The ${projectId} project can't be runner`)
    this.name = 'ProjectCanNotBeRunnerError'
  }
}
