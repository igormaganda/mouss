import type { User } from '@/store/use-app-store'

export function sanitizeUser(user: any): User {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    company: user.company,
    phone: user.phone,
    role: user.role,
    avatarUrl: user.avatarUrl,
    credits: user.credits ?? 0,
  }
}

function createToken(payload: object): string {
  const data = JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })
  return Buffer.from(data).toString('base64')
}

function verifyToken(token: string): object | null {
  try {
    const data = JSON.parse(Buffer.from(token, 'base64').toString())
    if (data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}

export function getUserFromRequest(req: Request): { userId: string; role: string } | null {
  const auth = (req as any).headers?.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const payload = verifyToken(auth.slice(7))
  if (!payload || typeof payload !== 'object' || !('userId' in payload)) return null
  return { userId: (payload as any).userId, role: (payload as any).role }
}

export { createToken, verifyToken }
