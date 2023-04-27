import { CollectionConfig } from 'payload/types'

const Weeks: CollectionConfig = {
  slug: 'weeks',
  admin: {
    defaultColumns: ['number', 'stage', 'createdAt'],
    useAsTitle: 'number',
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
      name: 'number',
      type: 'number',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'stage',
      type: 'text',
    },
  ],
}

export default Weeks
