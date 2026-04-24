const express = require('express')
const app = express()
require('dotenv').config({path: './src/.env'})
const cors = require('cors')
const { body, validationResult } = require('express-validator')
const initRoutes = require('./src/routes/index')

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send({ message: 'Bienvenue sur l\'API AssurMoi !' }).json();
})

app.use(express.json())
app.use(cors({
    credentials:true,
    origin: ['http://localhost:8081','*'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))

//initRoutes(app)
app.use('/api', initRoutes)

app.listen(PORT, ()=>{
    console.log('server running on port',PORT)
})

module.exports = app