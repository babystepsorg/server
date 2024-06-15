import type { CollectionConfig } from 'payload/types'

const Feedback: CollectionConfig = {
  slug: 'feedbacks',
  admin: {
    useAsTitle: 'type',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        {
          value: 'bugs',
          label: 'Bugs'
        },
        {
          value: 'ui',
          label: "UI"
        },
        {
          value: 'incorrect-information',
          label: "Incorrect Information",
        }
      ],
      admin: {
        readOnly: true
      }
    },
    {
      name: 'location',
      type: 'select',
      options: [
        {
          value: 'dashboard',
          label: 'Dashboard'
        },
        {
          value: 'checklist',
          label: "Checklist"
        },
        {
          value: 'learning-lounge',
          label: "Learning Lounge",
        },
        {
          value: 'shoppe',
          label: "Shoppe"
        },
        {
          value: 'specialists-hub',
          label: "Specialists Hub"
        }
      ],
      admin: {
        readOnly: true
      }
    },
    {
      name: 'information',
      type: "textarea",
      admin: {
        readOnly: true
      }
    }
  ],
}

export default Feedback
