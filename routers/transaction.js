const express = require("express");
const transaction = express.Router();
const { randomOrderNumber } = require("../helpers/utils");
const { chekout } = require("../controllers/transaction");

transaction.route("/").post(async (req, res) => {
  const { total_price, paid_amount } = req.body;

  const data = {
    no_order: randomOrderNumber(),
    total_price,
    paid_amount,
  };

  res.send(await chekout(data));
});

module.exports = transaction;
