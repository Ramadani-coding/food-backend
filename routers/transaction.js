const express = require("express");
const transaction = express.Router();
const { randomOrderNumber } = require("../helpers/utils");
const { chekout, getTransactions } = require("../controllers/transaction");

transaction.route("/").get(async (req, res) => {
  res.send(await getTransactions());
});

transaction.route("/").post(async (req, res) => {
  const { total_price, paid_amount, products } = req.body;

  const order = {
    no_order: randomOrderNumber(),
    total_price,
    paid_amount,
  };

  res.send(await chekout(order, products));
});

module.exports = transaction;
