const jwt = require('jsonwebtoken');

module.exports.checkAuth = (req, res, next) => {
    try {
        const token = req.headers.auth_token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "A hitelesítés nem sikerült"
        });
    }
};