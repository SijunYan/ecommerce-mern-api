const jwt = require("jsonwebtoken");
// authentication
const verifyToken = (req, res, next) => {
  if (req.headers.token) {
    const token = req.headers.token.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, decodedData) => {
      if (err) res.status(401).json("Token is not valid!");
      req.user = decodedData;
      // console.log("authentication succeed");
      // console.log(req.user);

      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

// authrization to specific route, in order to edit
const authorize = (req, res, next) => {
  // console.log(req.user._id, req.params.id);
  if (req.user._id === req.params.id || req.user.isAdmin) {
    // console.log("authorizeation succeed");
    next();
  } else res.status(403).json("You are not allowed to do that");
};

// authrization only for admin
const adminAuthorize = (req, res, next) => {
  // console.log(req.user._id, req.params.id);
  if (req.user.isAdmin) {
    // console.log("authorizeation succeed");
    next();
  } else res.status(403).json("You are not allowed to do that");
};

module.exports = { verifyToken, authorize, adminAuthorize };
