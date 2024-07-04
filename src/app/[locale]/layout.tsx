import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import CustomNextIntlClientProvider from '@/components/next-intl-provider'
import Header from '@/components/header'
import { getServerAuthSession } from '@/lib/auth'
import SessionProvider from '@/components/auth/provider'
import { getMessages } from 'next-intl/server'
import ToastProvider from '@/components/toast-provider'
import { GoogleAnalytics } from '@next/third-parties/google'
import ReactQueryProvider from '@/providers/react-query-provider'
import ReduxProvider from '@/providers/redux-provider'

type LocaleLayoutProps = {
  children: React.ReactNode
  params: {
    locale: string
  }
}
const locales = ['tr', 'en']
const inter = Inter({ subsets: ['latin'] })

export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  const session = await getServerAuthSession()
  const messages = await getMessages()
  if (!locales.includes(locale as any)) notFound()

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <GoogleAnalytics gaId={String(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID)} />
        <CustomNextIntlClientProvider locale={locale} messages={messages}>
          <ReactQueryProvider>
            <SessionProvider session={session}>
              <ToastProvider>
                <ReduxProvider>{children}</ReduxProvider>
              </ToastProvider>
            </SessionProvider>
          </ReactQueryProvider>
        </CustomNextIntlClientProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'TrendPOS',
  description: 'TrendPOS',
  icons: '/images/Asset.svg'
}
