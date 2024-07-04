import AuthLayoutWrapper from '@/components/auth/auth-layout'
import Header from '@/components/header'

type AuthLayoutProps = {
  children: React.ReactNode
  params: {
    locale: string
  }
}

export default function AuthLayout({ children, params: { locale } }: AuthLayoutProps) {
  return (
    <>
      <Header locale={locale} type='auth' />
      <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
    </>
  )
}
