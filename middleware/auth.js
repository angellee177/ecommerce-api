const jwt = require('jsonwebtoken');
const config = require('config');


function auth(req, res, next){
    const token = req.header("authentication-token");
    if(!token) return res.status(401).json("access denied, no token provied.");

    // split token
    const splitToken = token.split(" ")

    try {
        // verify the json token
        const decoded = jwt.verify(splitToken[1], config.get('jwtPrivateKey'));
        console.log('decoded', decoded)
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).json('invalid token.');
    }

}

module.exports = auth;
