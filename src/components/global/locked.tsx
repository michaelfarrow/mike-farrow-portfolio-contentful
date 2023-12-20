import { cookies } from 'next/headers'
import env from '@/lib/env-secret'
import LockedPassword from './locked-password'

export interface Props {
  children: React.ReactNode
  show: boolean
}

export default function Locked({ children, show }: Props) {
  const cookiesStore = cookies()
  const loginCookies = cookiesStore.get(env.PAGE_PASSWORD_COOKIE_NAME!)
  const locked = !loginCookies?.value

  return !show && locked ? <LockedPassword>{children}</LockedPassword> : children
}
