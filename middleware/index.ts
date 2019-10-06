import {
  handleCors,
  handleHelmet,
  handleRateLimiter,
  handleCompression,
  handleRequestParsing
} from './common'

export default [
  handleCompression,
  handleCors,
  handleHelmet,
  handleRateLimiter,
  handleRequestParsing
]