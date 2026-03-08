require("dotenv").config();
const express = require("express");
const cors = require("cors");

const wooCommerceRouter = require("./woocommerce");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/woocommerce", wooCommerceRouter);

app.listen(PORT, () => {
  console.log(`Backend-2 listening on port ${PORT}`);
});
