import { CollectionConfig } from 'payload/types'

const Changes: CollectionConfig = {
  slug: 'changes',
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
      name: 'descriptions',
      type: 'text',
    },
    {
      name: 'illustration',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'week',
      type: 'text',
    },
  ],
}

export default Changes
