const Url = require('../model/url');
const jwt = require('jsonwebtoken');
const secret = "lodamera";

const generateCode = async (url) => {
    const payload = { url };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    const shortUrlId = token.slice(0, 6);

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
        console.log("Error in saving URL:", error.message); // Enhanced error logging
        throw error; // Re-throw error to handle it elsewhere
    }
}

module.exports = generateCode;
