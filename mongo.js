const mongoose = require('mongoose')
const dbUri = `mongodb://localhost:27017/imgs`

// console.log(models)
module.exports = () => {
  mongoose.Promise = global.Promise
  const db = mongoose.connection.openUri(dbUri)
  require('./models/img')
  require('./models/count')
  
  return db
}