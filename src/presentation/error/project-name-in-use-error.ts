export class ProjectNameInUse extends Error {
  constructor () {
    super('This project name alredy in use!')
    this.name = 'ProjectNameInUse'
  }
}
