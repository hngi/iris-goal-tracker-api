import {
  handleCors,
  handleHelmet,
  handleRateLimiter,
  handleCompression,
  handleRequestParsing,
  handleUploadStorage
} from './common'

export default [
  handleUploadStorage,
  handleCompression,
  handleCors,
  handleHelmet,
  handleRateLimiter,
  handleRequestParsing
]