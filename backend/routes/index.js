const dotenv = require('dotenv')
dotenv.config({ path: './env' })
const express = require('express')
const router = express.Router()
const urlController = require('../controller/url')
const UserController = require('../controller/user')

router.post('/', urlController.createShortUrl)

router.delete('/', urlController.deleteUrl)

router.post('/signup', UserController.signup)

router.post('/signin', UserController.signin)

router.get('/', (req, res) => {
    res.json({message: 'Success'})
})

module.exports = router