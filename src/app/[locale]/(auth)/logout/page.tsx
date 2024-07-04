'use client'
import { getSession, signOut, useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

const LogoutPage = () => {
  signOut({
    callbackUrl: '/login'
  })
}

export default LogoutPage
