import {
  handleCors,
  handleHelmet,
  handleRateLimiter,
  handleCompression,
  handleRequestParsing
  handleUploadStorage
} from './common'

export default [
  handleCompression,
  handleCors,
  handleHelmet,
  handleRateLimiter,
  handleRequestParsing
  handleUploadStorage
]