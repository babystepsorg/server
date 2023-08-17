import { CollectionConfig } from 'payload/types'
import { isAdmin } from '../access/isAdmin'
import richText from '../fields/richText'

const Doctors: CollectionConfig = {
  slug: 'doctors',
  admin: {
    defaultColumns: ['name', 'profession', 'createdAt'],
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
      required: true,
    },
    {
      name: 'profession',
      type: 'text',
      required: true,
    },
    richText({ label: 'description' }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'social_links',
      label: 'Social Links',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            {
              label: 'Facebook',
              value: 'facebook',
            },
            {
              label: 'Twitter',
              value: 'twitter',
            },
            {
              label: 'LinkedIn',
              value: 'linkedin',
            },
            {
              label: 'WhatsApp',
              value: 'whatsapp'
            },
            {
              label: 'Website',
              value: 'web'
            },
            {
              label: 'Instagram',
              value: 'instagram'
            }
          ],
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
  ],
}

export default Doctors
