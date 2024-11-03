const Url = require('../model/url');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secret = "lodamera";

const generateCode = async (url) => {
    const payload = { url };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    // Generate a random 6-character alphanumeric string
    const shortUrlId = crypto.randomBytes(3).toString('hex'); // 3 bytes = 6 hex characters

    const newUrl = new Url({
        shortUrlId: shortUrlId,
        url: url,
        clicks: 0,
        date: new Date(),
    });

    try {
        await newUrl.save();
        return shortUrlId; 
    } catch (error) {
        console.log("Error in saving URL:", error.message);
        throw error;
    }
}

module.exports = generateCode;
