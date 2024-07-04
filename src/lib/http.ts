import axios from 'axios'
import { getSession, signOut } from 'next-auth/react'

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

http.interceptors.request.use(async config => {
  const session = await getSession()
  const accessToken = session?.token
  config.headers.Authorization = `Bearer ${accessToken}`
  config.headers['Accept-Language'] = localStorage.getItem('locale') || 'tr'
  return config
})

http.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    if (error.response.status === 401) {
      await signOut()
    }
    return Promise.reject(error)
  }
)

export default http
