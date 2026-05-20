import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user || !user.hashedPassword) return null
        const valid = await bcrypt.compare(credentials.password as string, user.hashedPassword)
        if (!valid) return null
        // Auto-promote ADMIN_EMAIL to admin if not already
        if (user.email === process.env.ADMIN_EMAIL && !user.isAdmin) {
          await prisma.user.update({ where: { id: user.id }, data: { isAdmin: true } })
        }
        const isAdmin = user.email === process.env.ADMIN_EMAIL ? true : user.isAdmin
        return { id: user.id, email: user.email, name: user.name, isAdmin, plan: user.plan }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false
        token.plan = (user as { plan?: string }).plan ?? "free"
      }
      return token
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string
        session.user.isAdmin = (token.isAdmin as boolean) ?? false
        session.user.plan = (token.plan as string) ?? "free"
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  session: { strategy: "jwt" },
})
