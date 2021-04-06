import { IDateHelper } from './date-helper-protocol'
export class DateHelper implements IDateHelper {
  now (): number {
    return Date.now()
  }
}
