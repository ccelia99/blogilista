const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(
        console.log('connected to MongoDB')
    )
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())


app.use(middleware.morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app