const dotenv = require('dotenv')
dotenv.config({ path: './env' })
const express = require('express')
const router = express.Router()
const urlController = require('../controller/url')

router.post('/', urlController.createShortUrl)

//router.get('/:shortUrlId', urlController.redirectToOriginalUrl)

router.delete('/', urlController.deleteUrl)

router.get('/', (req, res) => {
    res.json({message: 'Success'})
})

module.exports = router