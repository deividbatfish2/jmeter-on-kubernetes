import { DateHelper } from '../../../../presentation/utils/date/date-helper'
import { IDateHelper } from '../../../../presentation/utils/date/date-helper-protocol'

export const makeDateHelper = (): IDateHelper => new DateHelper()
