import { S3Client } from "@aws-sdk/client-s3"
import multer from "multer"
import multerS3 from "multer-s3"
import { nanoid } from "nanoid"
import config from "../config/index.js"

const s3 = new S3Client()
const s3Storage = multerS3({
  s3,
  bucket: process.env.S3_BUCKET_NAME,
  metadata: (req, file, cb) => {
    const metadata = { fieldName: file.fieldname }
    cb(null, metadata)
  },
  key: (req, file, cb) => {
    const fileName = `${nanoid()}-${file.originalname}`
    cb(null, fileName)
  },
  contentType: multerS3.AUTO_CONTENT_TYPE,
})

const localStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "src/uploads")
  },
  filename: (req, file, cb) => {
    const fileName = `${nanoid()}-${file.originalname}`
    cb(null, fileName)
  },
})

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"]
const MAX_FILE_SIZE_IN_MB = 5

export const upload = multer({
  storage: config.isLocal ? localStorage : s3Storage,
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) cb(null, true)
    else cb(null, false)
  },
  limits: {
    fileSize: 1024 * 1024 * MAX_FILE_SIZE_IN_MB,
  },
})
