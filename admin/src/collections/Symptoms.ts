import { CollectionConfig } from 'payload/types'

const Symptoms: CollectionConfig = {
  slug: 'symptoms',
  admin: {
    defaultColumns: ['name', 'week', 'createdAt'],
    useAsTitle: 'name',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
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
      type: "row",
      fields: [
        {
          name: 'weeks',
          type: 'relationship',
          relationTo: 'weeks',
          required: true,
          hasMany: true,
        },
        {
          label: 'Red Flag Weeks',
          name: 'red_flag_weeks',
          type: 'relationship',
          relationTo: 'weeks',
          hasMany: true
        }
      ]
    },
    {
      label: 'Tags',
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar'
      }
    }
  ],
}

export default Symptoms
