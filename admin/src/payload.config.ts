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
import Content from './collections/Content'
import Weeks from './collections/Weeks'
import Planner from './collections/Planner'

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  admin: {
    user: Users.slug,
  },
  collections: [
    Slider,
    Weeks,
    TodoLists,
    Planner,
    Content,
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
