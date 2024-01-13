const db = require("../configs/connection");

exports.chekout = async (data) => {
  const query = await db.query("INSERT INTO transactions SET ?", [data]);

  return query;
};
