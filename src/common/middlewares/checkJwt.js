const jwt = require("jsonwebtoken");

const JWT_SECRET = 's3cr3t_k3y_f0r_jwt@2024!';

function checkJWT(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).send("Token is required");
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send("Invalid token");
        }

        req.user = decoded;
        next();
    });
}

module.exports = { checkJWT };
