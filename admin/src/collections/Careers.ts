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
    create: isAdmin,
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'biline',
      type: 'text',
    },
    richText({ name: 'details' }),
    slugField(),
  ],
}

export default Careers
