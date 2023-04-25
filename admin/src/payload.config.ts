import { buildConfig } from 'payload/config'
import path from 'path'
import TodoLists from './collections/TodoLists'
import Users from './collections/Users'
import GentleReminder from './collections/GentleReminder'
import Symptoms from './collections/Symptoms'
import Changes from './collections/Changes'
import Products from './collections/Products'
import Doctors from './collections/Doctors'
import Media from './collections/Media'
import Slider from './collections/Slider'
import Posts from './collections/Post'

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
  },
  collections: [
    Slider,
    TodoLists,
    Posts,
    GentleReminder,
    Symptoms,
    Changes,
    Products,
    Doctors,
    Media,
    Users,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
})
