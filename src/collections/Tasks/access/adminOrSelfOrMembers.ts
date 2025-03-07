import { User } from '@/payload-types'
import { Access } from 'payload'

export const adminOrSelfOrMembers =
  (userField: string, membersField: string): Access<User> =>
  ({ req: { user } }) => {
    if (!user) return false

    if (user?.role?.includes('admin')) {
      return true
    }

    return {
      or: [
        {
          [userField]: {
            equals: user?.id,
          },
        },
        {
          [membersField]: {
            contains: user?.id,
          },
        },
      ],
    }
  }
