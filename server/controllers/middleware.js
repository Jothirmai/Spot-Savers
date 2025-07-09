const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or malformed authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token not found" });
    }

    const payload = jwt.verify(token, process.env.SECRET || "jafha71yeiqquy1#@!");
    req.user = payload;
    next();

  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { isLoggedIn };
