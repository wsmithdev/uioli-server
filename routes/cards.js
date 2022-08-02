"use strict";

/** Routes for cards. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Card = require("../models/cards");

const router = express.Router();

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.get("/", async function (req, res, next) {
  try {
    const user_id = res.locals.user.id;
    const cards = await Card.getUserCards(user_id);
    console.log(cards)
    return res.json({ cards });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:card_id", async function (req, res, next) {
  try {
    const card_id = req.params.card_id;
    const days = req.body.days;
    const freq = await Card.updateFreq(days, card_id)
    const nextUse = await Card.updateNextUse(card_id)

    res.json({freq, nextUse})

  } catch(err){
    return next(err)
  }
})

router.delete("/:card_id", async function (req, res, next) {
  try {
    const card_id = req.params.card_id;
    const resp = await Card.removeCard(card_id)
    console.log(resp)
    res.json(resp)

  } catch(err){
    next(err)
  }
})

router.patch("/notifications/:card_id", async function (req, res, next) {
  try {
    const card_id = req.params.card_id
    const response = await Card.toggleNotifications(card_id)
    res.json(response)
  } catch(err){
    next(err)
  }
})

module.exports = router;
