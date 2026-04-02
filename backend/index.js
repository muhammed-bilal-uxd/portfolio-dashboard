// env
require("dotenv").config();

// dependencies
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// routers
const wooCommerceRouter = require("./woocommerce");
const projectRouter = require("./project");
const projectDetailsRouter = require("./project-detail");
const projectSourceRouter = require("./project-source");

const { ProjectSource } = require("./mongodb");

// app
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log("PORT:", PORT);
console.log("MONGO_URI exists:", !!MONGO_URI);
console.log("MONGO_URI value:", MONGO_URI);

mongoose.connection.on("connected", async () => {
  console.log("🔥 Mongoose connected");

  // indexing
  // const indexes = await ProjectSource.collection.getIndexes();
  // console.log("indexes", indexes);

  // verify
  // const indexes = await ProjectSource.collection.getIndexes();
  // console.log("indexes", indexes);

  // sync indexes at last after all index issue fixed
  // await ProjectSource.syncIndexes();

  // update schema version
  // await ProjectSource.updateMany(
  //   {
  //     $or: [{ schemaVersion: 1 }, { schemaVersion: { $exists: false } }],
  //   },
  //   { $set: { schemaVersion: "v1" } },
  // )
  //   .then(() => {
  //     console.log("✅ Schema version updated");
  //   })
  //   .catch((err) => {
  //     console.log("❌ Schema version update failed:", err);
  //   });
});

mongoose.connection.on("error", (err) => {
  console.log("❌ Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ Mongoose disconnected");
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/woocommerce", wooCommerceRouter);
app.use("/projects", projectRouter);
app.use("/project-detail", projectDetailsRouter);
app.use("/project-source", projectSourceRouter);

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
