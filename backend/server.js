const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
const app = express()

const indexRouter = require('./routes/index.js')

const PORT = process.env.PORT || 5000

app.get('/test', (req, res) => {
    res.send('test route')
})

app.use(cors())
app.use(express.json())
app.use('/', indexRouter)

mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log('Database connection successfull'))
.catch((err) => console.log('error in db connection', err));


app.listen(PORT, () => { console.log(`Server running on ${PORT}`) })