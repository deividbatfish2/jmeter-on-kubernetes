export class RequiredFieldError extends Error {
  constructor (field: string) {
    super(`Field ${field} is required!`)
    this.name = 'RequeiredFieldError'
  }
}
