import { CollectionConfig } from 'payload/types'

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    defaultColumns: ['name', 'week', 'createdAt'],
    useAsTitle: 'name',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'assets',
      type: 'array',
      fields: [
        {
          type: 'upload',
          relationTo: 'media',
          name: 'media',
        },
      ],
    },
    {
      name: 'link',
      type: 'text',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'select',
          hasMany: true,
          required: true,
          options: ['Mother', 'Father'],
        },
        {
          name: 'week',
          type: 'relationship',
          relationTo: 'weeks',
          hasMany: true,
          required: true,
        },
      ],
    },
  ],
}

export default Products
