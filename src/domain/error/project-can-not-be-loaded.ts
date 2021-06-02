export class ProjectCanNotBeLoadedError extends Error {
  constructor (projectId: string) {
    super(`The ${projectId} project can't be loaded`)
    this.name = 'ProjectCanNotBeLoaded'
  }
}
