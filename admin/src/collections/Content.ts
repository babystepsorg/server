import type { CollectionConfig } from 'payload/types'

import { isAdmin } from '../access/isAdmin'
import { MediaBlock } from '../blocks/Media'
import richText from '../fields/richText'
import { slugField } from '../fields/slug'

const Content: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    // preview: (doc) => 'https://babysteps.world/testing/things',
    hideAPIURL: true,
  },
  versions: {
    drafts: true,
  },
  access: {
    create: isAdmin,
    read: () => true,
    readVersions: isAdmin,
    update: isAdmin,
    delete: isAdmin,
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
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (data: any) => {
          if (data.layout === 'video') return true
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
      name: 'author',
      type: 'relationship',
      relationTo: '_users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedOn',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
  ],
}

export default Content
