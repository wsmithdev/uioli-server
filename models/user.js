"use strict";
const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");
const e = require("express");

/** Related functions for users. */

class User {
  /** Get user info
   *
   * Returns:
   *
   */
  static async get(id) {
    const result = await db.query(
      `
    SELECT 
      id,
      first_name,
      last_name,
      email
    FROM users
    WHERE id = $1
    `,
      [id]
    );
    if (result.rowCount === 0) throw new NotFoundError("User not found");
    return result.rows[0];
  }

  /** Update user info
   *
   * Returns:
   *
   */
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      first_name: "first_name",
      last_name: "last_name",
      email: "email",
    });

    const idVarIdx = "$" + (values.length + 1);
    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING 
                      first_name,
                      last_name,
                      email
                       `;
    const result = await db.query(querySql, [...values, id]);
    const user = result.rows[0];
    if (!user) throw new NotFoundError("User not found");
    delete user.password;
    return user;
  }

  /** Delete user
   *
   * Returns:
   *
   */
  static async remove(id) {
    const result = await db.query(
      `
      DELETE FROM users
      WHERE id = $1
      `,
      [id]
    );
    console.log(result);
    if (result.rowCount === 0) throw new NotFoundError("User not found");
    return id;
  }

  /** Create new user
   *
   * Returns:
   *
   **/
  static async register({ first_name, last_name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `
      INSERT INTO users
        (first_name,
         last_name,
         email,
         password)
      VALUES ($1, $2, $3, $4)
      RETURNING 
        id, 
        first_name, 
        last_name, 
        email`,
      [first_name, last_name, email, hashedPassword]
    );
    const user = result.rows[0];
    return user;
  }

  /** Login user
   *
   * Returns
   *
   **/
  static async authenticate(email, password) {
    const result = await db.query(
      `
    SELECT 
      id,
      first_name,
      last_name,
      email,
      password
    FROM users
    WHERE email = $1`,
      [email]
    );
    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid email / password");
  }

  /** Set plaid access token
   *
   * Returns:
   *
   **/
  static async setAccessToken(token, id) {
    const access_token_id = await db.query(
      `
      INSERT INTO access_tokens
        (user_id, plaid_access_token)
      VALUES ($1, $2)
      RETURNING id
      `,
      [id, token]
    );

    const result = await db.query(
      `
    UPDATE users
    SET token_id = $1
    WHERE id = $2
    RETURNING id`,
      [access_token_id.rows[0].id, id]
    );
    return result;
  }

  /**
   *
   * get access token
   *
   **/
  static async getAccessToken(id) {
    const result = await db.query(
      `
    SELECT plaid_access_token
    FROM users
    WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }

  /**
   *
   * create credit card
   *
   **/
  static async createCard(id, user_id, bank, last_used, card_name) {
    let lastUsed = new Date(last_used);

    // Check if bank name already exists in database
    const bank_id_res = await db.query(
      `
      SELECT * 
      FROM banks
      WHERE bank_name = $1 
      `,
      [bank]
    );

    let bank_id;
    if (bank_id_res.rowCount > 0) {
      bank_id = bank_id_res.rows[0].id;
    } else {
      const id_resp = await db.query(
        `
        INSERT INTO banks (bank_name)
        VALUES ($1)
        RETURNING id
        `,
        [bank]
      );
      bank_id = id_resp.rows[0].id;
    }

    // Add card to database

    const resp = await db.query(
      `
      INSERT INTO cards (id, user_id, bank_name_id, last_used, card_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [id, user_id, bank_id, lastUsed, card_name]
    );

    return resp.rows[0];
  }
}

module.exports = User;
