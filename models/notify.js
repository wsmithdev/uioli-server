"use strict";
const db = require("../db");

class Notify {
  static async getCards() {
    const res = await db.query(`
        SELECT 
            users.first_name,
            users.email,
            banks.bank_name,
            cards.card_name
        FROM cards
        FULL OUTER JOIN users users ON cards.user_id = users.id
        FULL OUTER JOIN banks banks ON cards.bank_name_id = banks.id
        WHERE notifications = true AND next_use < 7
        `);

    return res.rows;
  }
}

module.exports = Notify;
