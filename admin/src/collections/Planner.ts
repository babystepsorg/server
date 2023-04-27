import { CollectionConfig } from 'payload/types'

const Planner: CollectionConfig = {
  slug: 'planners',
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
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'select',
          hasMany: true,
          required: true,
          options: ['Mother', 'Father'],
        },
        {
          name: 'week',
          type: 'relationship',
          relationTo: 'weeks',
          hasMany: true,
          required: true,
          admin: {
            allowCreate: false,
          },
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

export default Planner
