const logger = require('./logger')

const morgan = require('morgan')
morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
      return response.status(400).send({
        error: 'malformatted id'
      })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({
        error: error.message 
      })
    } else if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({
        error: 'invalid token'
      })
    }
  
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}  

module.exports = {
    morgan,
    unknownEndpoint,
    errorHandler
  }
