const User = require('../models/Users')
const jwt = require('jsonwebtoken')

const handleErrors = (err) => {
  console.log(err.message, err.code)
  let errors = { email: '', password: '' }

  //incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'The email is not registered'
  }

  //incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'The password is incorrect'
  }

  //duplicate error code
  if (err.code === 11000) {
    errors.email = 'That email is already exist'
    return errors
  }

  //validation errors
  if (err.message.includes('users validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      //   console.log(properties)
      errors[properties.path] = properties.message
    })
  }
  return errors
}

// Creating Token
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
  return jwt.sign({ id }, 'evanSecretKey', {
    expiresIn: maxAge,
  })
}

const getSignup = (req, res) => {
  res.render('signup')
}

const getLogin = (req, res) => {
  res.render('login')
}

const postSignup = async (req, res) => {
  const { email, password } = req.body
  //   console.log(email, password)
  try {
    const user = await User.create({ email, password })
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(404).json({})
  }
}

const postLogin = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(200).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(404).json({ errors })
  }
}

const getLogout = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.redirect('/')
}

module.exports = { getSignup, postSignup, getLogin, postLogin, getLogout }
