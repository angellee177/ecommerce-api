const jwt = require('jsonwebtoken');
const config = require('config');


function auth(req, res, next){
    const token = req.header("authentication-token");
    if(!token) return res.status(401).send("access denied, no token provied.");

    // split token
    const splitToken = token.split(" ")

    try {
        // verify the json token
        const decoded = jwt.verify(splitToken[1], config.get('jwtPrivateKey'));
        req.user = decoded;
        console.log(req.user)
        next();
    }
    catch (ex) {
        res.status(400).send('invalid token.');
    }

}

module.exports = auth;
