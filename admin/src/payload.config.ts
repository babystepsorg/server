import { buildConfig } from 'payload/config'
import path from 'path'
import { slateEditor } from '@payloadcms/richtext-slate'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'

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
import Subheadings from './globals/Subheading'
import Tags from './collections/Tag'
import RecommendedProducts from './collections/RecommendedProducts'
import RecommendedSpecialists from './collections/RecommendedSpecialists'

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
    Tags,
    Media,
    Users,
    RecommendedProducts,
    RecommendedSpecialists
  ],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI
  }),
  editor: slateEditor({}),
  globals: [
    Subheadings
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  upload: {
    limits: {
      fileSize: 100000000, // 10 MB, written in bytes
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
  admin: {
    bundler: webpackBundler(),
    user: Users.slug,
    webpack: config => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config?.resolve?.alias,
          react: path.resolve(__dirname, '../node_modules/react'),
          'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
          'react-router-dom': path.resolve(__dirname, '../node_modules/react-router-dom'),
        }
      }
    })
  },
})
