import { getSession, signOut } from 'next-auth/react'

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  token?: string
}

async function fetchClient(url: string, options: FetchOptions = { method: 'GET', data: undefined, token: undefined }) {
  const locale = localStorage.getItem('locale') || 'tr'
  const method = options.method || 'GET'

  try {
    const session = await getSession()
    const accessToken = options.token || session?.token

    if (url.startsWith('/')) {
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
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
        signOut()
      }

      throw error
    }

    throw new Error('Failed to fetch data')
  }
}

export default fetchClient
