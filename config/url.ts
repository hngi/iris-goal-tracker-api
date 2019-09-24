const dotenv = require(`dotenv`).config() //require env constiables to make file independent

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbBase = process.env.DB_BASE
const mongoURI = process.env.MONGODB_URI
const dbName = process.env.DB_NAME

export const connectStrings: any = {
  development: {
    url: `mongodb://localhost:27017/${dbName}`,
    port: 5000
  },
  staging: {
    url: mongoURI || `mongodb://${dbUser}:${dbPassword}@${dbBase}`,
    port: 5300
  },
  production: {
    url: mongoURI || `mongodb://${dbUser}:${dbPassword}@${dbBase}`,
    port: 5300
  }
}
