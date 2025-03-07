import type { CollectionConfig } from 'payload'

import { adminOrCreateRoleMember } from './access/adminOrCreateRoleMember'
import { isAdmin } from '@/access/isAdmin'
import { adminOrSelf } from '@/access/adminOrSelf'
import { validateRole } from './hooks/validateRole'
import { adminSelfOrAdded } from './access/adminSelfOrAdded'
import { fillAddedByField } from './hooks/fillAddedByField'
import { adminSelfOrMember } from './access/adminSelfOrMember'

export const Users: CollectionConfig = {
  slug: 'users',
  typescript: {
    interface: 'User',
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: adminOrCreateRoleMember,
    delete: isAdmin,
    unlock: isAdmin,
    read: adminSelfOrMember,
    update: adminOrSelf('id'),
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },

  hooks: {
    beforeValidate: [fillAddedByField],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Shareholder', value: 'shareholder' },
        { label: 'Member', value: 'member' },
      ],
      hasMany: true,
      defaultValue: ['member'],
    },
    {
      name: 'addedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        hidden: true,
      },
    },
  ],
  timestamps: true,
}
