import type { CollectionConfig } from 'payload/types'

import { isAdmin } from '../access/isAdmin'
import richText from '../fields/richText'
import { slugField } from '../fields/slug'

const Content: CollectionConfig = {
  slug: 'contents',
  dbName: "contents",
  admin: {
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  versions: {
    drafts: true,
  },
  access: {
    create: () => true,
    read: () => true,
    readVersions: () => true,
    update: () => true,
    delete: () => true,
  },
  //   hooks: {
  //     afterChange: [
  //       ({ req: { payload }, doc }) => {
  //         regeneratePage({
  //           payload,
  //           collection: 'posts',
  //           doc,
  //         })
  //       },
  //     ],
  //   },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'radio',
      options: [
        {
          label: 'Post',
          value: 'post',
        },
        {
          label: 'Video',
          value: 'video',
        },
      ],
      defaultValue: 'post',
      name: 'layout',
    },
    {
      type: 'radio',
      options: [
        {
          label: 'Upload',
          value: 'upload',
        },
        {
          label: 'Link',
          value: 'link',
        },
      ],
      defaultValue: 'link',
      name: 'type',
      admin: {
        condition: (data: any) => {
          if (data.layout === 'video') return true
        }
      }
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (data: any) => {
          if (data.layout === 'video' && data.type === 'upload') return true
        },
      },
    },
    {
      name: 'video_url',
      type: 'text',
      label: 'YouTube URL',
      required: true,
      admin: {
        condition: (data: any) => {
          if (data.layout === 'video' && data.type === 'link') return true
        },
      },
    },
    {
      name: 'hero_image',
      label: 'Hero Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (data: any) => {
          if (data.layout === 'post') return true
        },
      },
    },
    richText({
      name: 'body',
      admin: {
        condition: (data: any) => {
          if (data.layout === 'post') return true
        },
      },
    }),
    {
      type: 'row',
      fields: [
        {
          name: 'weeks',
          type: 'relationship',
          relationTo: 'weeks',
          hasMany: true,
          required: true,
        },
        {
          name: 'roles',
          type: 'select',
          hasMany: true,
          required: true,
          options: ['Mother', 'Father'],
        },
      ],
    },
    slugField(),
    {
      label: 'Tags',
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
      label: 'Specialist Tags',
      name: 'specialist_tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar'
      }
    }
    // {
    //   name: 'author',
    //   type: 'relationship',
    //   relationTo: 'admin_users',
    //   required: true,
    //   admin: {
    //     position: 'sidebar',
    //   },
    // },
    // {
    //   name: 'publishedOn',
    //   type: 'date',
    //   required: true,
    //   admin: {
    //     date: {
    //       pickerAppearance: 'dayAndTime',
    //     },
    //     position: 'sidebar',
    //   },
    // },
  ],
}

export default Content
