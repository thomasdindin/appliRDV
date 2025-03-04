const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    console.log("token", token);
    if (!token) {
        return res.status(401).json({ message: "Token is required" });
    }
    try {
        const verified = jwt.verify(token, process.env.SECRET);
        req.user = verified;
        next();
    }  catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authenticate;