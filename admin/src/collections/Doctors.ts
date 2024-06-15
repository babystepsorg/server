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
      name: 'location',
      type: 'text',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar'
      }
    },
    {
      label: 'Symptom Tags',
      name: 'symptom_tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar'
      }
    },
    {
      label: 'Product Tags',
      name: 'product_tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar'
      }
    },
    {
      label: 'Content Tags',
      name: 'content_tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'phone',
      type: 'text',
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
            },
            {
              label: "YouTube",
              value: 'youtube'
            }
          ],
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
    {
      name: 'referralId',
      type: 'text',
      defaultValue: () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let referralId = '';
        for (let i = 0; i < Math.floor(Math.random() * (8 - 6 + 1)) + 6; i++) {
          referralId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return referralId;
      },
      required: true,
      admin: {
        readOnly: true
      }
    },
  ],
}

export default Doctors
