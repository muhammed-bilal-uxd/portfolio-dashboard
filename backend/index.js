require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getJson } = require("serpapi");

const app = express();
const PORT = process.env.PORT || 4000;
const serpApiKey = process.env.SERPAPI_KEY;

app.use(cors());
app.use(express.json());

// Health route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Games route - queries Google Play games via SerpAPI
app.get("/games", (req, res) => {
  const query = req.query.q || "face";

  if (!serpApiKey) {
    return res.status(500).json({ error: "Missing SERPAPI_KEY in environment" });
  }

  getJson(
    {
      engine: "google_play_games",
      q: query,
      api_key: serpApiKey,
    },
    (json) => {
      res.json(json["organic_results"] || []);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
