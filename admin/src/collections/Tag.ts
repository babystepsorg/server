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
      name: 'type',
      type: 'select',
      options: [
        {
          label: "Category",
          value: "category"
        },
        {
          label: "Symptom Category",
          value: "symptom"
        },
        {
          label: "Specialist Category",
          value: "specialist"
        },
        {
          label: "Products Category",
          value: "product"
        },
        {
          label: "Content Category",
          value: "content"
        }
      ]
    },
  ],
}

export default Tags
