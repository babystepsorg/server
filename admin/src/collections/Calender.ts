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
          name: 'roles',
          type: 'select',
          hasMany: true,
          required: true,
          options: ['Mother', 'Father'],
        },
        {
          name: 'weeks',
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
    {
      type: "row",
      fields: [
        {
          type: "select",
          name: "color",
          options: [
            {
              label: 'Blue',
              value: 'bg-[#6259CE]'
            },
            {
              label: 'Green',
              value: 'bg-[#28C66F]'
            },
            {
              label: 'Yellow',
              value: 'bg=[#FFAB00]'
            },
          ]
        },
        {
          name: "day",
          type: 'select',
          options: [
            {
              label: '1',
              value: '1'
            },
            {
              label: '2',
              value: '2'
            },
            {
              label: '3',
              value: '3'
            },
            {
              label: '4',
              value: '4'
            },
            {
              label: '5',
              value: '5'
            },
            {
              label: '6',
              value: '6'
            },
            {
              label: '7',
              value: '7'
            },
          ]
        }
      ]
    },
  ],
}

export default Planner
