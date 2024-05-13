import { CollectionConfig } from 'payload/types'
import InfoComponent from '../components/InfoComponent'

const Weeks: CollectionConfig = {
  slug: 'weeks',
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    defaultColumns: ['title', 'stage', 'createdAt'],
    useAsTitle: 'title',
    hideAPIURL: true,
    components: {
      views: {
        Edit: {
          Default: {
            Tab: {
              label: "Edit"
            }
          },
          Testing: {
            Component: InfoComponent,
            path: '/info',
            Tab: {
              label: "Info",
              href: '/info'
            }
          }
        }
      }
    }
  },
  fields: [
    {
      name: 'title',
      type: 'text', // should be text maybe
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'stage',
      type: 'text',
    },
    {
      name: 'overview',
      type: 'text',
    },
    {
      name: 'message',
      type: 'text',
    },
    {
      label: 'Red Flag Symptoms',
      name: 'red_flag_symptoms',
      type: 'relationship',
      relationTo: 'symptoms',
      hasMany: true
    }
  ],
}

export default Weeks
