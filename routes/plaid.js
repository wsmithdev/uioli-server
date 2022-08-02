"use strict";

require("dotenv").config();
const {
  Configuration,
  PlaidEnvironments,
  PlaidApi,
  ItemPublicTokenExchangeRequest,
  transactionsGet,
} = require("plaid");

const User = require("../models/user");
const { extractCreditCards } = require("../helpers/extractCreditCards");
const { getDates } = require("../helpers/getDates");


const express = require("express");
const router = new express.Router();
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || "";
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || "transactions").split(
  ","
);
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || "US").split(
  ","
);
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET_SANDBOX;

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});
const client = new PlaidApi(configuration);

/** Routes for Plaid API. */

/** POST /api/create_link_token
 *
 * Returns:
 *
 */
router.post("/api/create_link_token", function (req, res, next) {
  Promise.resolve()
    .then(async function () {
      const configs = {
        user: {
          client_user_id: "user-id",
        },
        client_name: "Plaid Quickstart",
        products: PLAID_PRODUCTS,
        country_codes: PLAID_COUNTRY_CODES,
        language: "en",
      };

      const createTokenResponse = await client.linkTokenCreate(configs);
      res.json(createTokenResponse.data);
    })
    .catch(next);
});

/** POST /api/swap_public_token
 *
 * Returns:
 *
 */
router.post("/api/swap_public_token", async (req, res, next) => {
  const user_id = res.locals.user.id;
  const request = {
    public_token: req.body.publicToken,
  };
  try {
    // Exchange public token for access token
    const tokenRes = await client.itemPublicTokenExchange(request);
    const access_token = tokenRes.data.access_token;

    // Save access token to the database
    await User.setAccessToken(access_token, user_id);

    // Get user accounts linked to the access token
    const accountsRes = await client.accountsGet({ access_token });
    const accounts = accountsRes.data.accounts;

    // Bank ID
    const institution_id = accountsRes.data.item.institution_id;

    // Extract credit cards from retrieved accounts
    const creditCards = extractCreditCards(accounts);

    // Create and save cards to the database
    for (const creditCard of creditCards) {
      const { start_date, end_date } = getDates();
      const { account_id, name } = creditCard
      const request = {
        access_token,
        start_date,
        end_date,
        options: {
          account_ids: [account_id],
          count: 1,
        },
      };

      // Get bank info
      const bank = await client.institutionsGetById({
        institution_id: institution_id,
        country_codes: ["US"],
      });
      const institution = bank.data.institution.name;

      // Get last transaction
      const transactionsRes = await client.transactionsGet(request);
      const last_used = transactionsRes.data.transactions[0].date;

      // Save card to the database
      await User.createCard(
        account_id,
        user_id,
        institution,
        last_used,
        name
      );
    }
    res.json({ creditCards });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
