const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
    try {

        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({ message: "Token missing" });
        }

        const token = header.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;

        next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = protect;
