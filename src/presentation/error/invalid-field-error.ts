export class InvalidFieldError extends Error {
  constructor (field: string) {
    super(`Field ${field} is invalid!`)
    this.name = 'InvalidFieldError'
  }
}
