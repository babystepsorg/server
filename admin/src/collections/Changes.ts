import { CollectionConfig } from 'payload/types'

const Changes: CollectionConfig = {
  slug: 'changes',
  admin: {
    defaultColumns: ['mother_description', 'week', 'createdAt'],
    useAsTitle: 'mother_description',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'mother_description',
      label: 'Mother Description',
      type: 'text',
      required: true,
    },
    {
      name: 'baby_description',
      label: 'Baby Description',
      type: 'text',
      required: true,
    },
    {
      name: 'week',
      type: 'relationship',
      relationTo: 'weeks',
      required: true,
      hasMany: true,
    },
  ],
}

export default Changes
