const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access. Token absent" });
    } else {
      let decodedData = jwt.verify(token, process.env.SECRET);

      req.user = { userID: decodedData.id };
      next();
    }
  } catch (error) {
    res.status(403).json({ success: false, errorMessage: error.message });
  }
};

module.exports = { verifyAuth };
