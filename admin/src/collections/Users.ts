import type { CollectionConfig } from 'payload/types'

import { isAdmin, isAdminFieldLevel } from '../access/isAdmin'
import { isAdminOrSelf, isAdminOrSelfFieldLevel } from '../access/isAdminOrSelf'

export const Users: CollectionConfig = {
  slug: 'admin_users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['public'],
      required: true,
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
      },
      options: ['admin', 'author', 'public'],
    },
  ],
}

export default Users
