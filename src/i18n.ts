import { getRequestConfig } from 'next-intl/server'

// fetch messages from an api
export default getRequestConfig(async ({ locale }) => ({
  messages: await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/felocalization/${locale}`).then(res =>
    res.json().then(data => data?.data)
  )
}))
