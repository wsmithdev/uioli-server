"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userSignupSchema = require("../schemas/userSignup.json");
const { BadRequestError } = require("../expressError");

/** POST /
 *
 * Authorization required:
 *
 */

router.post("/signin", async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.authenticate(email, password);
    const token = createToken(user);
    return res.json({ token, user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
