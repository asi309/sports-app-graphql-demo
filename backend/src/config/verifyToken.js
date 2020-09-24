// function verifyToken(req, res, next) {
//   const bearerToken = req.header('user');
//   if (typeof bearerToken !== 'undefined') {
//     req.token = bearerToken;
//     next();
//   } else {
//     res.status(403).send();
//   }
// }

// module.exports = verifyToken;


const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = (req, res, next) => {
    const authHeader = req.header('user');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader;
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
    } catch (error) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
};