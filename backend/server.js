const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000
const mongoDB = require('./config/db')
const errorHandler = require('./middleWare/errorHandler')

mongoDB()
const app = express()

// CORS configuration - allow multiple origins for dev and prod
const allowedOrigins = [
  "http://localhost:3000",  // Local development
  "http://localhost:5000",  // Local development alternative
  "https://task-manager-client-blush.vercel.app", // Production frontend (update with your actual URL after deployment)
  process.env.FRONTEND_URL  // Dynamic frontend URL from env
].filter(Boolean)

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/tasks', require('./routes/taskRoute'))
app.use('/api/users', require('./routes/userRoute'))
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})