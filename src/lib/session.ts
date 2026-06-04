import { cookies } from 'next/headers'
import { prisma } from './db'

export function getSessionUserId(): number | null {
  const val = cookies().get('userId')?.value
  return val ? parseInt(val) : null
}

export async function getSessionUser() {
  const id = getSessionUserId()
  if (!id) return null
  return prisma.user.findUnique({ where: { id } })
}
