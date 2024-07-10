import { CollectionConfig, CollectionBeforeChangeHook } from 'payload/types'
import { isAdmin } from '../access/isAdmin'
import richText from '../fields/richText'

const addReferralId: CollectionBeforeChangeHook = async ({ data, req, operation }: { data: any; req: any; operation: string }) => {
      if (operation === 'create' || operation === 'update') {
        const name = data.name.replace(/dr/i, "").replace(/\./g, "").replace(/\s/g, "").toUpperCase();
        const referralId = name;
        data.referralId = referralId;
      }
      return data;
    }

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
  hooks: {
    beforeChange: [addReferralId]
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
      required: false,
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'tags',
      type: 'select',
      options: [
        {
          label: "Judgment Free",
          value: "judgment-free",
        },
        {
          label: "Sex Positive",
          value: "sex-positive",
        },
        {
          label: "Queer Friendly",
          value: "queer-friendly",
        },
        {
          label: "Safe Space",
          value: "safe-space",
        },
        {
          label: "Reassuring",
          value: "reassuring",
        },
        {
          label: "Good Listner",
          value: "good-listener",
        }
      ],
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
      admin: {
        readOnly: true
      }
    },
  ],
}

export default Doctors
