"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");

const usersRoutes = require("./routes/users");
const bodyParser = require( "body-parser" );

const plaidRoutes = require("./routes/plaid")
const cardRoutes = require("./routes/cards")
const tokenRoutes = require("./routes/token")

const { cron } = require("./cron")

const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors());
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/plaid", plaidRoutes);
app.use("/cards", cardRoutes);
app.use("/token", tokenRoutes);

cron()



/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  console.log("404 route was hit")
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
