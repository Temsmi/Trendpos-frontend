'use client'
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl'

type NextIntlProps = {
  children: React.ReactNode
  locale: string
  messages: AbstractIntlMessages
}
const CustomNextIntlClientProvider = ({ children, locale, messages, ...props }: NextIntlProps) => {
  const now = new Date()
  const timeZone = typeof Intl === 'object' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Europe/Istanbul'
  return (
    <NextIntlClientProvider
      // Define non-serializable props here
      defaultTranslationValues={{
        i: text => <i>{text}</i>
      }}
      // Make sure to forward these props to avoid markup mismatches
      locale={locale}
      timeZone={timeZone}
      now={now}
      messages={messages}
      {...props}>
      {children}
    </NextIntlClientProvider>
  )
}
export default CustomNextIntlClientProvider
