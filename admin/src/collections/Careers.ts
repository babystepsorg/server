import type { CollectionConfig } from 'payload/types'

import { isAdmin, isAdminFieldLevel } from '../access/isAdmin'
import { isAdminOrSelf, isAdminOrSelfFieldLevel } from '../access/isAdminOrSelf'
import richText from '../fields/richText'
import Media from './Media'
import { slugField } from '../fields/slug'

const Careers: CollectionConfig = {
  slug: 'careers',
  admin: {
    useAsTitle: 'title',
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
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'job_type',
      label: 'Job Type',
      type: 'text',
    },
    {
      name: 'category',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    richText({ name: 'details' }),
    slugField(),
  ],
}

export default Careers
