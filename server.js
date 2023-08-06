const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const productRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");

const port = process.env.PORT || 8000;

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then((data) =>
    console.log(`MondoDB connected with: ${data.connection.host}`)
  )
  .catch((err) => console.log(err));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/products", productRouter);
app.use("/api", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
