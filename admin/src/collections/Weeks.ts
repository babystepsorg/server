import { CollectionConfig } from 'payload/types'

const Weeks: CollectionConfig = {
  slug: 'weeks',
  admin: {
    defaultColumns: ['number', 'stage', 'createdAt'],
    useAsTitle: 'title',
    hideAPIURL: true,
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
      name: 'planner_description',
      label: 'Planner Descripion',
      type: 'text',
    },
    {
      name: 'symptoms_description',
      label: 'Symptoms Descripion',
      type: 'text',
    },
    {
      name: 'todo_description',
      label: 'Todo Descripion',
      type: 'text',
    },
    {
      name: 'content_description',
      label: 'Content Descripion',
      type: 'text',
    },
    {
      name: 'product_description',
      label: 'Product Descripion',
      type: 'text',
    },
    {
      name: 'specialist_description',
      label: 'Specialist Descripion',
      type: 'text',
    },
  ],
}

export default Weeks
