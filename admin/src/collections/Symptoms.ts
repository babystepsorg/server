import { CollectionConfig } from 'payload/types'

const Symptoms: CollectionConfig = {
  slug: 'symptoms',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'weeks',
      type: 'relationship',
      relationTo: 'weeks',
      required: true,
      hasMany: true,
    },
  ],
}

export default Symptoms
