const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/biologia-total', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

module.exports = mongoose