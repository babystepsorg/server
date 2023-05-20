import multer from 'multer'
import multerS3 from 'multer-s3'
import { S3Client } from '@aws-sdk/client-s3'
import path from 'path'

require('dotenv').config()

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY, // store it in .env file to keep it safe
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
  region: 'ap-south-1', // this is the region that you select in AWS account
})

const s3Storage = multerS3({
  s3: s3, // s3 instance
  bucket: 'babysteps-assets', // change it as per your project requirement
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname })
  },
  key: (req, file, cb) => {
    const fileName = Date.now() + '_' + file.fieldname + '_' + file.originalname
    cb(null, fileName)
  },
})

// function to sanitize files and send error for unsupported files
function sanitizeFile(file, cb) {
  // Define the allowed extension
  const fileExts = ['.png', '.jpg', '.jpeg', '.pdf', '.docx', '.doc']

  // Check allowed extensions
  const isAllowedExt = fileExts.includes(path.extname(file.originalname.toLowerCase()))

  // Mime type must be an image
  const isAllowedMimeType =
    file.mimetype.startsWith('image/') || file.mimetype.startsWith('application/')

  if (isAllowedExt && isAllowedMimeType) {
    return cb(null, true) // no errors
  } else {
    // pass error msg to callback, which can be displaye in frontend
    cb('Error: File type not allowed!')
  }
}

// our middleware
const uploadImage = multer({
  storage: s3Storage,
  fileFilter: (req, file, callback) => {
    sanitizeFile(file, callback)
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // 2mb file size
  },
})

export default uploadImage
