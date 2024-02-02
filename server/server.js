const express = require('express')

// Loads all the environment variables in the project
require('dotenv').config()

const dbConfig = require('./config/DBconfig')
const userRoutes = require('./routes/userRoutes')
const movieRoutes = require('./routes/movieRoutes')
const theatreRoutes = require('./routes/theatreRoutes')
const showRoutes = require('./routes/showRoutes')
const bookingRoutes = require('./routes/bookingRoutes')

const app = express()

app.use(express.json())

app.use('/api/users', userRoutes.router)
app.use('/api/movies', movieRoutes.router)
app.use('/api/theatres', theatreRoutes.router)
app.use('/api/shows', showRoutes.router)
app.use('/api/bookings', bookingRoutes.router)


app.listen(8080, ()=>{
    console.log('Server has started');
})