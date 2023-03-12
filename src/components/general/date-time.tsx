import clsx from 'clsx'
import dayjs from '@/lib/dayjs'

export const DATE_FORMATS = {
  MONTH_YEAR_FULL: 'MMMM YYYY',
}

export interface Props extends Omit<React.ComponentPropsWithoutRef<'time'>, 'dateTime'> {
  str: string
  format?: string
  date?: boolean
  time?: boolean
}

export default function DateTime({ className, str, format, date, time, ...rest }: Props) {
  const dateTime = dayjs(str)
  let _format = format
  if (!format) {
    if ((date && time) || (!date && !time)) {
      _format = 'DD/MM/YYYY mm:ss'
    } else if (date) {
      _format = 'DD/MM/YYYY'
    } else if (time) {
      _format = 'mm:ss'
    }
  }
  return (
    <time {...rest} className={clsx('date-time', className)} dateTime={dateTime.format()}>
      {dateTime.format(_format)}
    </time>
  )
}

export interface DateRangeProps extends React.ComponentPropsWithoutRef<'span'> {
  from: string
  to?: string
  monthFormat?: string
  yearFormat?: string
  join?: string
  noJoinSpaces?: boolean
  showDuration?: boolean
  hideMonth?: boolean
}

export function DateRange({
  className,
  from,
  to,
  monthFormat = 'MMM',
  yearFormat = 'YYYY',
  join = '-',
  noJoinSpaces,
  showDuration,
  hideMonth,
  ...rest
}: DateRangeProps) {
  const _from = dayjs(from)
  const _to = to && dayjs(to)
  const durationTo = _to || dayjs()

  const space = noJoinSpaces ? '' : ' '
  const joiner = `${space}${join}${space}`

  let label: string
  let duration: string

  const days = durationTo.diff(_from, 'days')
  const months = durationTo.diff(_from, 'months')
  const years = durationTo.diff(_from, 'years')
  if (days <= 31) {
    duration = '1 month'
  } else if (months < 12) {
    duration = `${months} month${months !== 1 ? 's' : ''}`
  } else {
    duration = `${years} year${years !== 1 ? 's' : ''}`
  }

  /*
    Jan 2021 - Present   no to
    Jan-Feb 2021         year same
    Jan 2021             month and year are the same
    Jan 2021 - Feb 2022  year different
  */

  if (!_to) {
    // Jan 2021 - Present (no to)
    label = `${_from.format(`${!hideMonth ? `${monthFormat} ` : ''}${yearFormat}`)}${joiner}Present`
  } else {
    if (_from.year() === _to.year()) {
      if (_from.month() === _to.month()) {
        // Jan 2021 (month and year are the same)
        label = `${_from.format(`${!hideMonth ? `${monthFormat} ` : ''}${yearFormat}`)}`
      } else {
        // Jan-Feb 2021 (year same, month different)
        label = `${
          !hideMonth ? `${_from.format(monthFormat)}${joiner}${_to.format(monthFormat)} ` : ''
        }${_from.format(yearFormat)}`
      }
    } else {
      // Jan 2021 - Feb 2022 (year different)
      label = `${_from.format(
        `${!hideMonth ? `${monthFormat} ` : ''}${yearFormat}`
      )}${joiner}${_to.format(`${!hideMonth ? `${monthFormat} ` : ''}${yearFormat}`)}`
    }
  }

  return (
    <span {...rest} className={clsx('date-range', className)}>
      {label}
      {showDuration && ` (${duration})`}
    </span>
  )
}
