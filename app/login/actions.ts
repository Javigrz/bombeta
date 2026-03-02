'use server'

import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SECRET = new TextEncoder().encode(process.env.DASHBOARD_JWT_SECRET ?? 'dev-secret')

export async function validateLogin(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const validUsername = process.env.DASHBOARD_USERNAME
  const validPassword = process.env.DASHBOARD_PASSWORD

  if (username !== validUsername || password !== validPassword) {
    return { error: 'Credenciales incorrectas' }
  }

  const token = await new SignJWT({ sub: username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)

  const cookieStore = await cookies()
  cookieStore.set('dashboard_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  redirect('/dashboard')
}
