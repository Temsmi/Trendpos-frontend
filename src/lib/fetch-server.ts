import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
}

async function fetchServer(url: string, options: FetchOptions = { method: 'GET', data: undefined }) {
  const locale = await getLocale()
  const method = options.method || 'GET'

  try {
    const session = await getServerSession(authOptions)

    if (url.startsWith('/')) {
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + session?.token,
        'Accept-Language': locale
      },
      body: (options.data && JSON.stringify(options.data)) || undefined
    })

    if (!response.ok) {
      throw response
    }

    return response
  } catch (error) {
    if (error instanceof Response) {
      if (error.status === 401) {
        redirect('/logout')
      }

      throw error
    }

    throw error
  }
}

export default fetchServer
