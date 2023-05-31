import { CollectionConfig } from 'payload/types'

const Weeks: CollectionConfig = {
  slug: 'weeks',
  admin: {
    defaultColumns: ['number', 'stage', 'createdAt'],
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
  ],
}

export default Weeks
