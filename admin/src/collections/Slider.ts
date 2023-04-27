import { CollectionConfig } from 'payload/types'

const Slider: CollectionConfig = {
  slug: 'slider-images',
  admin: {
    defaultColumns: ['link'],
    useAsTitle: 'link',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'link',
      label: 'Link',
      type: 'text',
    },
    {
      name: 'stage',
      type: 'select',
      hasMany: true,
      required: true,
      options: ['Preconception', 'Pregnancy', 'Postpartum'],
    },
  ],
}

export default Slider
