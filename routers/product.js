const express = require("express");
const product = express.Router();
const { getProducts, createProduct } = require("../controllers/product");

product.route("/").get(async (req, res) => {
  const query = getProducts();
  res.send(await query);
});

product.route("/").post(async (req, res) => {
  const { name, price, stock } = req.body;

  const data = { name, price, stock };

  res.send(await createProduct(data));
});

module.exports = product;
