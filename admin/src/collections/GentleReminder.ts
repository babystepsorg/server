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
      required: true,
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
      type: 'row',
      fields: [
        {
          name: 'weeks',
          type: 'relationship',
          relationTo: 'weeks',
          hasMany: true,
          required: true,
        },
        {
          name: 'roles',
          type: 'select',
          hasMany: true,
          required: true,
          options: ['Mother', 'Father'],
        },
      ],
    },
  ],
}

export default GentleReminder
