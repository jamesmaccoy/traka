import { FieldAccess } from 'payload'

export const adminOrSelfField =
  (field: string): FieldAccess =>
  ({ req: { user }, doc }) => {
    if (!user) return false

    if (user?.role?.includes('admin')) {
      return true
    }

    if (!user.role?.includes('shareholder')) {
      return false
    }

    return doc?.[field] === user.id
  }
