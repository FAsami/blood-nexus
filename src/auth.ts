import bcrypt from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
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
    async jwt({ token, account, user }) {
      if (
        account?.provider === 'email_password' ||
        account?.provider === 'phone_password' ||
        account?.provider === 'verify_otp'
      ) {
        token.credentials = true
      }
      if (user && user.id) {
        token.id = user.id
        const userData = await getUser({ id: user.id })
        token.phone = userData?.phone || null
        const userWithRoles = await prismaClient.user.findUnique({
          where: { id: user.id },
          include: { userRoles: { include: { role: true } } }
        })
        if (userWithRoles?.userRoles) {
          const roles = userWithRoles.userRoles.map(
            (userRole) => userRole.role.name
          )
          token.roles = roles
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.roles = token.roles as string[]
        session.user.phone = token.phone as string | null
      }
      return session
    }
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.AUTH_SECRET!
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
