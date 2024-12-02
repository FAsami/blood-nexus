import { prismaClient } from '../lib/prismaClient'

const getUser = async ({
  id,
  phone,
  email
}: {
  id?: string
  phone?: string
  email?: string
}) => {
  try {
    if (!id && !email && !phone) return null

    const user = await prismaClient.user.findFirst({
      where: {
        OR: [
          ...(id ? [{ id }] : []),
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : [])
        ]
      },
      include: {
        accounts: true
      }
    })

    return user
  } catch (error) {
    console.log('[GET USER ERROR]', error)
    return null
  }
}

export { getUser }
