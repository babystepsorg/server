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
import Calender from './collections/Calender'
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3'
import Careers from './collections/Careers'

const adapter = s3Adapter({
  config: {
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
    region: process.env.S3_REGION,
  },
  bucket: process.env.S3_BUCKET,
})

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  admin: {
    user: Users.slug,
  },
  collections: [
    Weeks,
    Slider,
    Calender,
    GentleReminder,
    Symptoms,
    Changes,
    Content,
    Products,
    Doctors,
    TodoLists,
    Careers,
    Media,
    Users,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  upload: {
    limits: {
      fileSize: 10000000, // 10 MB, written in bytes
    }
  },
  plugins: [
    cloudStorage({
      collections: {
        media: {
          adapter,
        },
      },
    }),
  ],
})
