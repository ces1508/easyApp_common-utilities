const im = require('imagemagick')
const request = require('request')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const TOKEN = process.env.SECRET__TOKEN || 'asdasdasdadasd'
const JwtStrategy = require('passport-jwt').Strategy
const ExtactJwt = require('passport-jwt').ExtractJwt

const readImage = (path) => {
  return new Promise((resolve, reject) => {
    im.identify(path, (err, info) => {
      if (err) return reject(new Error(err.message))
      resolve(info)
    })
  })
}

const resizeImage = (path, width, height = width) => {
  return new Promise((resolve, reject) => {
    im.resize({
      srcPath: path,
      dstPath: path,
      quality: 0.8,
      width,
      height
    }, err => {
      if (err) return reject(new Error())
      resolve(true)
    })
  })
}

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtactJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = TOKEN

const Strategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  let options = {
    method: 'GET',
    uri: `http://companies/${payload.id}`
  }
  request(options, (err, response, data) => {
    if (err) {
      return done(true, null, { error: true, messsage: 'unauthorized' })
    }
    done(null, {
      id: data.id,
      status: data.status
      // plan: data.plan
    })
  })
})

const generateJwtToken = (data) => {
  try {
    // expiresIn: '120s'
    let token = jwt.sign(data, TOKEN, {})
    return token
  } catch (e) {
    return { error: true, code: 'FATAL ERROR', message: 'cant not create jwt toiken' }
  }
}

const encrypText = async (txt, salt = null) => {
  if (!salt) {
    salt = await crypto.randomBytes(50)
    salt = salt.toString('hex')
  }
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(txt, salt.toString(), 100000, 128, 'sha512', (err, derivedKey) => {
      if (err) return reject(new Error(err))
      resolve({salt, encode: derivedKey.toString('hex')})
    })
  })
}
const validateData = (requiredFields, data) => {
  let errors = []
  for (let field of requiredFields) {
    if (!data.hasOwnProperty(field)) {
      errors.push(field)
    }
  }
  return {
    error: errors.length > 0,
    message: `the fields ${errors.toString()} are required`
  }
}

const handleErrors = (req, res) => {
  let { error } = req.errors
  switch (error.code) {
    case 'NOT_FOUND':
      res.status(404).json({ error: true, code: error.code })
      break
    case 'UNAUTHORIZADE':
      res.status(403).json({ error: true, code: error.code })
      break
    default:
      res.status(500).json({ error: true, code: 'UNKNOW_ERROR' })
  }
}

module.exports = {
  readImage,
  resizeImage,
  Strategy,
  generateJwtToken,
  encrypText,
  validateData,
  handleErrors
}
