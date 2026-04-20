// env
require("dotenv").config();

// dependencies
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// routers
const wooCommerceRouter = require("./woocommerce");
const projectRouter = require("./project");
const projectSourceRouter = require("./project-source");
const projectChartRouter = require("./project-chart");

const { ProjectSource, ProjectChart } = require("./mongo-schema");

const { migrateSchemaVersion } = require("./migration");

// app
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log("PORT:", PORT);
console.log("MONGO_URI exists:", !!MONGO_URI);
console.log("MONGO_URI value:", MONGO_URI);

mongoose.connection.on("connected", async () => {
  console.log("🔥 Mongoose connected");

  await migrateSchemaVersion();
});

mongoose.connection.on("error", (err) => {
  console.log("❌ Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ Mongoose disconnected");
});

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : [];

app.use(
  cors({
    origin: true,
    // origin: function (origin, callback) {
    //   if (!origin || allowedOrigins.includes(origin)) {
    //     callback(null, true);
    //   } else {
    //     callback(new Error("Not allowed by CORS"));
    //   }
    // },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/woocommerce", wooCommerceRouter);
app.use("/projects", projectRouter);
app.use("/project-source", projectSourceRouter);
app.use("/project-chart", projectChartRouter);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ DB connection success");

    app.listen(PORT, () => {
      console.log(`Backend-2 listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ DB connection failed:", err.message);
    console.log(err);
  });
