"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

router.post("/:id", async function (req, res, next) {
  try {
    const token = req.body.token;
    const id = req.params.id;

    const result = await User.setAccessToken(token, id)
    return res.json(result.rows[0])

  
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
