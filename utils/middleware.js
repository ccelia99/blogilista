const jwt = require('jsonwebtoken')
const User = require('../models/user')


const userExtractor =  async (request, response, next) => { 

  const authorization = request.get('authorization')
  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    return response.status(401).json({ error: 'token missing or invalid' })
  } 
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!request.token || !decodedToken.id) {
   return response.status(401).json({ error: 'token missing or invalid' })    
 } 
    const user = await User.findById(decodedToken.id)
    request.user = user
  next() 
}

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
}
  
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}  

module.exports = {
    morgan,
    userExtractor,
    unknownEndpoint,
    errorHandler
  }
