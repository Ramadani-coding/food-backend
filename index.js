const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const product = require("./routers/product");
const transaction = require("./routers/transaction");

app.use("/products", product);
app.use("/transactions", transaction);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
