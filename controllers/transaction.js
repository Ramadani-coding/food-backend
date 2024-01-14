const db = require("../configs/connection");

exports.getTransactions = async () => {
  const query = await db.query(
    "SELECT * FROM transactions AS t INNER JOIN transaction_detail AS i ON t.no_order = i.no_order LEFT JOIN products AS p ON i.product_id = p.id"
  );

  if (!query.error) {
    let listTransactions = [],
      listDetail = [],
      lastPush = "";

    for (let index in query) {
      if (lastPush !== query[index].no_order) {
        for (let i in query) {
          if (query[i].no_order === query[index].no_order) {
            listDetail.push({
              no_order: query[i].no_order,
              product: query[i].name,
              price: query[i].price,
              quantity: query[i].quantity,
            });
          }
        }
        listTransactions.push({
          no_order: query[index].no_order,
          total_price: query[index].total_price,
          paid_amount: query[index].paid_amount,
          products: listDetail,
        });
        listDetail = [];
        lastPush = query[index].no_order;
      }
    }
    return { transactions: listTransactions };
  }
};

exports.chekout = async (order, products) => {
  const query = await db.query("INSERT INTO transactions SET ?", [order]);

  if (!query.code) {
    let dataProducts = [];
    let idProducts = [];

    products.map((item) => {
      dataProducts.push([item.id, order.no_order, item.quantity]);
      idProducts.push([item.id]);
    });

    const queryDetailTransaction = db.query(
      "INSERT INTO transaction_detail (product_id, no_order, quantity) VALUES ?",
      [dataProducts]
    );

    const stockProduct = await db.query(
      "SELECT stock FROM products WHERE id IN (?)",
      [idProducts]
    );

    let updateStock = [];

    stockProduct.map((res, i) => {
      updateStock.push([dataProducts[i][0], res.stock - dataProducts[i][2]]);
    });

    await db.query(
      "INSERT INTO products (id, stock) VALUES ? ON DUPLICATE KEY UPDATE stock = VALUES(stock)",
      [updateStock]
    );
  }

  const dataOrder = await db.query(
    `SELECT * FROM transactions WHERE no_order = '${order.no_order}'`
  );
  return dataOrder;
};
