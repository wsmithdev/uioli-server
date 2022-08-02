const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken({ id, firstName, lastName, email }) {
  let payload = {
    id,
    firstName,
    lastName,
    email,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
