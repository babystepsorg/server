import { CollectionConfig } from 'payload/types'

const Weeks: CollectionConfig = {
  slug: 'weeks',
  admin: {
    defaultColumns: ['title', 'stage', 'createdAt'],
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text', // should be text maybe
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'stage',
      type: 'text',
    },
    {
      name: 'overview',
      type: 'text',
    },
    {
      name: 'message',
      type: 'text',
    },
    {
      label: 'Red Flag Symptoms',
      name: 'red_flag_symptoms',
      type: 'relationship',
      relationTo: 'symptoms',
      hasMany: true
    }
  ],
}

export default Weeks
