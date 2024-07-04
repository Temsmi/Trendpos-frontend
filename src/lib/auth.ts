import { getServerSession, type DefaultSession, type DefaultUser, type NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

declare module 'next-auth' {
  interface User extends DefaultUser {
    fullName: string
    email: string
    phoneNumber: string
    token?: string
  }

  interface Session extends DefaultSession {
    user: User
    token: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User
    token: string
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
    signOut: '/logout'
  },
  session: {
    strategy: 'jwt',
    // decrease 1 hour from maxAge
    maxAge: 7 * 24 * 60 * 60 - 3600
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        uniqueIdentifier: { label: 'Email&Phone', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })

        if (!response.ok) {
          return null
        }

        const data = await response.json()

        if (!data?.data?.token) {
          return null
        }

        return { ...data.data }
      }
    })
  ],
  jwt: {
    maxAge: 7 * 24 * 60 * 60 - 3600
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = { id: 'test', fullName: user?.fullName, email: user?.email, phoneNumber: user?.phoneNumber }
        user?.token && (token.token = user?.token)
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user = token.user
        session.token = token.token
      }
      return session
    }
  }
}

export const getServerAuthSession = () => getServerSession(authOptions)
