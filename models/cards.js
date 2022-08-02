"use strict";
const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const { getNextUse } = require("../helpers/getNextUse")

class Card {
  /**
   *
   * Get all cards that belong to a user
   *
   **/

  static async getUserCards(user_id) {
    const result = await db.query(
      `
          SELECT 
            cards.id,
            cards.user_id,
            bank.bank_name,
            freq.days,
            cards.notifications,
            cards.last_used,
            cards.next_use,
            cards.card_name
          FROM cards
          FULL OUTER JOIN banks bank ON cards.bank_name_id = bank.id
          FULL OUTER JOIN usage_freq freq ON cards.usage_freq_id = freq.id
          WHERE user_id = $1`,
      [user_id]
    );
    const cards = result.rows;
    return cards
  }

  static async updateFreq(days, card_id) {
    // Get days id
    const freq_id_res = await db.query(
      `
      SELECT id
      FROM usage_freq
      WHERE days = $1
      `,
      [days]
    )
    const freq_id = freq_id_res.rows[0].id

    // Update card freq
    const result = await db.query(
      `
      UPDATE cards
      SET usage_freq_id = $1
      WHERE id = $2
      RETURNING usage_freq_id
      `,
      [freq_id, card_id]
    )

    // Get days
    const daysRes = await db.query(
      `
      SELECT days
      FROM usage_freq
      WHERE id = $1
      `,
      [result.rows[0].usage_freq_id]
    )
    return daysRes.rows[0].days
  }

  static async updateNextUse(card_id) {

    // Get card info
    const lastUsedRes = await db.query(
      `
      SELECT last_used, usage_freq_id
      FROM cards
      WHERE id = $1
      `,
      [card_id]
    )
    const lastUsedDate = lastUsedRes.rows[0].last_used
    const freqId = lastUsedRes.rows[0].usage_freq_id

    // Get frequency
    const freqRes = await db.query(
      `
      SELECT days
      FROM usage_freq
      WHERE id = $1
      `,
      [freqId]
    )
    const days = freqRes.rows[0].days
    const nextUseDate = getNextUse(lastUsedDate, days)

    // Save next use date
    const nextUseRes =  await db.query(
      `
      UPDATE cards
      SET next_use = $1
      WHERE id = $2
      RETURNING next_use
      `,
      [nextUseDate, card_id]
    )

    return nextUseRes.rows[0].next_use

  }

  static async removeCard(card_id){
    // Delete card
    const resp = await db.query(
      `
      DELETE FROM cards
      WHERE id = $1
      RETURNING id
      `, [card_id]
    )
    return resp.rows[0]
  }

  static async toggleNotifications(card_id){
    const resp = await db.query(
      `
      UPDATE cards
      SET notifications = NOT notifications
      WHERE id = $1
      RETURNING notifications
      `, [card_id]
    )
    return resp.rows[0]
  }

 
}

module.exports = Card;
