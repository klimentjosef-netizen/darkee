import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Heslo', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const merchant = await prisma.merchant.findUnique({
          where: { email: credentials.email },
        })

        if (!merchant) return null

        // Password je uložený v apiKey poli (pro jednoduchost v MVP)
        // V produkci by byl dedikovaný password hash field
        const isValid = await compare(credentials.password, merchant.apiKey)
        if (!isValid) return null

        return {
          id: merchant.id,
          email: merchant.email,
          name: merchant.shopName,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.merchantId = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { merchantId?: string }).merchantId = token.merchantId as string
      }
      return session
    },
  },
  pages: {
    signIn: '/merchant/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
