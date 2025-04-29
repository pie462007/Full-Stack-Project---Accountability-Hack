require('dotenv').config()
require('./utils/scheduler');

const express = require('express')
const mongoose = require('mongoose')
const habitRoutes = require('./routes/habits')
const userRoutes = require('./routes/user')
// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/habits', habitRoutes)
app.use('/api/user', userRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Connected to database', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })