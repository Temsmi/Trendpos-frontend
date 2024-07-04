import Header from '@/components/header'
import Sidebar from '@/components/header/sidebar'
import fetchServer from '@/lib/fetch-server'

type PublicLocaleLayoutProps = {
  children: React.ReactNode
  params: {
    locale: string
  }
}

export default async function PublicLayout({ children, params: { locale } }: PublicLocaleLayoutProps) {
  const userResponse = await fetchServer('/auth/user-info')
  const user = await userResponse.json()

  return (
    <main>
      {
        /* @ts-ignore */
        // Here is the header component with the locale prop set to 'tr'
        // TODO: Language can be changed by the user, so this should be dynamic, locale should be a state
      }
      <Header locale={locale} type='public' userInfo={user.data} />
      <div className='flex bg-[#E6E6E6]'>
        {/*{user.data.roles.includes('company_admin') || user.data.roles.includes('branch_admin') ? <Sidebar /> : null}*/}
        <Sidebar />
        <div className='flex h-full w-full items-center justify-center p-1'> {children}</div>
      </div>
    </main>
  )
}
