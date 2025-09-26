/**
 * authenticate user with bearer token
 */

const { json } = require("body-parser");
const { readDatabase } = require("../utils/dbOps");

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({
      error: {
        status: false,
        message: "Unauthorized request",
      },
    });
  }
  const token = authorization.split(" ")[1];
  const user = JSON.parse(atob(token));
  if (typeof user != "object" || !user.username) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized request",
    });
  }
  const db = readDatabase();
  const existingUser = db["users"].find(u => u.username === user.username);

  if (!existingUser) {
    return res.status(401).json({
      status: false,
      message: "User does not exist",
    });
  }
  req.user = existingUser;
  next();
}

module.exports = authMiddleware;
