import { getServerAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const isAuth = await getServerAuthSession()
  redirect(isAuth ? '/dashboard' : '/login')
}
