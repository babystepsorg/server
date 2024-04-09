import { CollectionConfig } from 'payload/types'

const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    defaultColumns: ['title', 'description', 'createdAt'],
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
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'category',
      type: 'checkbox'
    }
  ],
}

export default Tags
