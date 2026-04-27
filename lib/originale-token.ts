import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.ORIGINALE_TOKEN_SECRET ?? 'dev-originale-secret'
)

export async function signOriginaleToken(email: string): Promise<string> {
  return new SignJWT({ email: email.trim().toLowerCase(), scope: 'originale' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(SECRET)
}

export async function verifyOriginaleToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    if (payload.scope !== 'originale') return null
    if (typeof payload.email !== 'string') return null
    return payload.email
  } catch {
    return null
  }
}
