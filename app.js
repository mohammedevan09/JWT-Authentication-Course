const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

// middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs')

// database connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/users')
    console.log('Database is connected')
  } catch (error) {
    console.log('Database disconnected')
    process.exit(1)
  }
}

// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'))
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'))
app.use(authRoutes)

// //cookies
// app.get('/set-cookies', (req, res) => [
//   // res.setHeader('Set-Cookie', 'newUser=true'),
//   res.cookie('newUser', false),
//   res.cookie('employee', 113, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }),
//   res.send('you got the cookies!'),
// ])

// app.get('/read-cookies', (req, res) => {
//   const cookies = req.cookies
//   // console.log(cookies)
//   res.json(cookies)
// })

app.listen(8000, () => {
  console.log('Server is running in localhost:8000')
  connectDB()
})
