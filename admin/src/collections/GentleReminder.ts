import { CollectionConfig } from 'payload/types'

const GentleReminder: CollectionConfig = {
  slug: 'genetle-reminders',
  admin: {
    defaultColumns: ['title', 'week', 'createdAt'],
    useAsTitle: 'title',
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
      name: 'edit',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'week',
      type: 'text',
    },
  ],
}

export default GentleReminder
