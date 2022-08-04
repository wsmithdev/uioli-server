const { BadRequestError } = require("../expressError");

/* This function returns data to be used in the SQL queries to update
    values in the db. It takes all the fields passed in and adds incrementing '$'
    along with an array of values.

*/

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = {
  sqlForPartialUpdate,
};
