import { CollectionConfig } from 'payload/types'

const Todo: CollectionConfig = {
  slug: 'todos',
  admin: {
    defaultColumns: ['title', 'week', 'updatedAt'],
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
      name: 'description',
      type: 'text',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'week',
          type: 'relationship',
          relationTo: 'weeks',
          required: true,
          hasMany: true,
        },
        {
          name: 'priority',
          type: 'select',
          options: [
            {
              label: 'Normal',
              value: '1',
            },
            {
              label: 'Low',
              value: '2',
            },
            {
              label: 'Medium',
              value: '3',
            },
            {
              label: 'High',
              value: '4',
            },
          ],
          defaultValue: '1',
        },
      ],
    },
  ],
}

export default Todo
