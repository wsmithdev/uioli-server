const { BadRequestError } = require("../expressError");

/* This function returns data to be used in the SQL queries to update
    values in the db. It takes all the fields passed in and adds incrementing '$'
    along with an array of values.

    Eg. {firstName: 'Aliya', age: 32} will return 
    ['"first_name"=$1', '"age"=$2'] along with the corresponding values
    ['Aliya', 32]
*/

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

/* This function returns the WHERE clause of a SQL query based on the parametes given.
    Possible parameters are name, minEmployees and maxEmployees
*/

function companySqlWhereClause(filter = {}) {
  const { name, minEmployees, maxEmployees } = filter;
  let whereExpressions = [];
  let queryValues = [];
  let query = "";

  if (minEmployees > maxEmployees) {
    throw new BadRequestError("Min employees cannot be greater than max");
  }

  if (minEmployees !== undefined) {
    queryValues.push(minEmployees);
    whereExpressions.push(`num_employees >= $${queryValues.length}`);
  }

  if (maxEmployees !== undefined) {
    queryValues.push(maxEmployees);
    whereExpressions.push(`num_employees <= $${queryValues.length}`);
  }

  if (name) {
    queryValues.push(`%${name}%`);
    whereExpressions.push(`name ILIKE $${queryValues.length}`);
  }

  if (whereExpressions.length > 0) {
    query += " WHERE " + whereExpressions.join(" AND ");
  }

  return { query, queryValues };
}

function jobSqlWhereClause(filter = {}) {
  const { title, minSalary, hasEquity } = filter;
  let whereExpressions = [];
  let queryValues = [];
  let query = "";

  
  if (title !== undefined) {
    queryValues.push(`%${title}%`);
    whereExpressions.push(`title ILIKE $${queryValues.length}`);
  }

  if (minSalary !== undefined) {
    queryValues.push(minSalary);
    whereExpressions.push(`salary >= $${queryValues.length}`);
  }

  if (hasEquity === "true" || hasEquity === true) {
    whereExpressions.push(`equity > 0.0`);
  }

  if (whereExpressions.length > 0) {
    query += " WHERE " + whereExpressions.join(" AND ");
  }

  return { query, queryValues };
}

module.exports = {
  sqlForPartialUpdate,
  companySqlWhereClause,
  jobSqlWhereClause,
};
