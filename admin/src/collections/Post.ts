import type { CollectionConfig } from 'payload/types'

import { isAdmin } from '../access/isAdmin'
import { MediaBlock } from '../blocks/Media'
import richText from '../fields/richText'
import { slugField } from '../fields/slug'

const Posts: CollectionConfig = {
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    richText({
      name: 'body',
    }),
    // {
    //   name: 'content',
    //   type: 'blocks',
    //   blocks: [MediaBlock],
    //   required: true,
    // },
    slugField(),
    // {
    //   name: 'author',
    //   type: 'relationship',
    //   relationTo: 'users',
    //   required: true,
    //   admin: {
    //     position: 'sidebar',
    //   },
    // },
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

export default Posts
