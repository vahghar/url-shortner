const URL = require('../model/url')
const validate = require('../utils/validate')
const generateCode = require('../utils/generateCode')

async function createShortUrl(req, res) {
    const url = req.body.url;
    const clientUrl = "chakka"

    if(!validate(url)) {
        return res.status(400).json({message: "Invalid URL"});
    }
    try {
        const urlDoc = await URL.findOne({url: url})
        if(urlDoc) {
            const shortUrl = `${clientUrl}/${urlDoc.shortUrlId}`
            res.status(200).json({shortUrl: shortUrl, clicks: urlDoc.clicks});
            console.log("url already present", shortUrl)
            return;
        }

        const shortUrlId = await generateCode(url)

        const newUrlDoc = new URL({
            url,
            shortUrlId,
            date: new Date()
        })

        await newUrlDoc.save()

        const shortUrl = `${clientUrl}/${shortUrlId}`
        res.status(200).json({shortUrl: shortUrl, clicks: 0});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

async function deleteUrl(req, res) {
    const url = req.body.url;
    try{
        const deletedUrl  = await URL.deleteOne({url:url});
        if(deletedUrl.deletedCount === 0){
            res.status(404).json({message: "URL not found"});
            return;
        }
        res.status(200).json({message: "URL deleted successfully"});
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports={createShortUrl,deleteUrl}