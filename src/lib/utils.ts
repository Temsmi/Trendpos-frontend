import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'

export function cn(...args: (string | undefined | null | boolean)[]) {
  return twMerge(classNames(...args))
}
export function formatDate(date: Date | string, opposite?: boolean) {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear().toString()
  if (opposite) {
    return `${year}-${month}-${day}`
  }
  return `${day}-${month}-${year}`
}
