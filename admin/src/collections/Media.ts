import path from 'path'
import type { CollectionConfig } from 'payload/types'

import { isAdmin } from '../access/isAdmin'

const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve(__dirname, '../../media'),
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'darkModeFallback',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Choose an upload to render if the visitor is using dark mode.',
      },
    },
  ],
}

export default Media
