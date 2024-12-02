import bcrypt from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import { encode as jwtEncode } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import { v4 as uuid } from 'uuid'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import { getUser } from './query/user'
import { LoginSchema } from '@/schema/auth'
import { prismaClient } from '@/lib/prismaClient'

const adapter = PrismaAdapter({
  prisma: prismaClient
})

const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  adapter,
  debug: false,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!
    }),
    Credentials({
      id: 'phone_password',
      async authorize(credential) {
        const { data, success } = LoginSchema.safeParse(credential)
        if (success) {
          const user = await getUser({
            phone: credential.phone as string
          })
          if (!user || !user.password) return null
          if (user?.id) {
            const isMatched = await bcrypt.compare(data.password, user.password)
            if (isMatched) {
              return user
            }
          }
        }
        return null
      }
    }),
    Credentials({
      id: 'email_password',
      async authorize(credential) {
        const { data, success } = LoginSchema.safeParse(credential)
        if (success) {
          const user = await getUser({
            email: data.email
          })
          if (!user || !user.password) return null
          if (user?.id) {
            const isMatched = await bcrypt.compare(data.password, user.password)
            if (isMatched) {
              return user
            }
          }
        }
        return null
      }
    }),
    Credentials({
      id: 'verify_otp',
      async authorize(credential) {
        const user = await getUser({
          email: credential.email as string | undefined,
          phone: credential.phone as string | undefined
        })

        if (user?.id) {
          return user
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (
        account?.provider === 'email_password' ||
        account?.provider === 'phone_password' ||
        account?.provider === 'verify_otp'
      ) {
        token.credentials = true
      }
      return token
    }
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid()
        if (!params.token.sub) {
          throw new Error('No user is associated with this token')
        }
        const session = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        })
        if (!session) {
          throw new Error('Something went wrong while trying to create session')
        }
        return sessionToken
      }
      return jwtEncode(params)
    }
  },
  secret: process.env.AUTH_SECRET!
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
