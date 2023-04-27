import { CollectionConfig } from 'payload/types'

const Todo: CollectionConfig = {
  slug: 'todos',
  admin: {
    defaultColumns: ['weekName', 'tasks', 'updatedAt'],
    useAsTitle: 'weekName',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'weeks',
      type: 'relationship',
      relationTo: 'weeks',
      unique: true,
      required: true,
    },
    {
      name: 'tasks',
      type: 'array',
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
