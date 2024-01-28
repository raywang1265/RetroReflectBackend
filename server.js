
const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const { scraper } = require('./index.js');

const NAMESPACE = 'Server';
const router = express();

/** Log the request */
router.use((req, res, next) => {
    /** Log the req */
    console.log(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Log the res */
        console.log(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    })

    next();
});

/** Parse the body of the request */
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
/** Rules of our API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, access-control-allow-origin');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});
// localhost:8000/uofthacks
router.post('/uofthacks', async (req, res, next) => {
    console.log(req.body['mood'])
    const response = await scraper('https://en.wikipedia.org/wiki/AFI%27s_100_Years...100_Movie_Quotes', 'https://www.goalcast.com/anime-quotes/', req.body['mood']);
    return res.status(200).json(dictData)
})

const httpServer = http.createServer(router);

httpServer.listen(8000, () => console.log(`Server is running`));