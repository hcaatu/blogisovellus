const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { process_params } = require('express/lib/router')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name == 'JsonWebTokenError') {
    return response.status(400).json({ error: 'invalid or missing token' })
  }

  next(error)
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '')
    }
    next()
}

const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        const decodedToken = jwt.verify(authorization.replace('Bearer ', ''), process.env.SECRET)

        const user = await User.findById(decodedToken.id)
        req.user = user
    }
    next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}