const express = require("express");
const https = require("https");
const http = require("http");

const router = express.Router();

function buildWooBaseUrl(websiteUrl) {
  if (!websiteUrl) {
    throw new Error("Missing websiteUrl");
  }

  const base = new URL(websiteUrl);
  const apiBase = new URL("/wp-json/wc/v3/", base);
  return apiBase;
}

function validateRequiredParams(params, requiredKeys, source = "query") {
  const missing = requiredKeys.filter((key) => !params[key]);

  if (missing.length > 0) {
    const error = new Error(
      `Missing required ${source} parameter(s): ${missing.join(", ")}`,
    );
    error.statusCode = 400;
    throw error;
  }
}

function callWooCommerceApi(
  { websiteUrl, consumerKey, consumerSecret },
  path,
  query = {},
) {
  return new Promise((resolve, reject) => {
    if (!websiteUrl || !consumerKey || !consumerSecret) {
      return reject(
        new Error(
          "Missing WooCommerce credentials (websiteUrl, consumerKey, consumerSecret)",
        ),
      );
    }

    try {
      const apiBase = buildWooBaseUrl(websiteUrl);
      const fullUrl = new URL(path.replace(/^\//, ""), apiBase);

      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          fullUrl.searchParams.append(key, String(value));
        }
      });

      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
        "base64",
      );
      const client = fullUrl.protocol === "https:" ? https : http;

      const options = {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      };

      const req = client.request(fullUrl, options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsed = data ? JSON.parse(data) : null;

            if (res.statusCode >= 400) {
              const message =
                parsed && parsed.message
                  ? parsed.message
                  : `WooCommerce API error: ${res.statusCode}`;
              return reject(new Error(message));
            }

            resolve(parsed);
          } catch (err) {
            reject(err);
          }
        });
      });

      req.on("error", (err) => {
        reject(err);
      });

      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

router.post("/all", async (req, res) => {
  try {
    // Accept only a single credentials object from req.body
    const { websiteUrl, consumerKey, consumerSecret } = req.body;

    // Validate required params directly from req.body
    validateRequiredParams(
      req.body,
      ["websiteUrl", "consumerKey", "consumerSecret"],
      "body",
    );

    const creds = { websiteUrl, consumerKey, consumerSecret };

    // Fetch orders, products, and customers for the single site
    const [orders, products, customers] = await Promise.all([
      callWooCommerceApi(creds, "orders"),
      callWooCommerceApi(creds, "products"),
      callWooCommerceApi(creds, "customers"),
    ]);

    res.json({
      websiteUrl,
      orders,
      products,
      customers,
    });
  } catch (err) {
    console.error("WooCommerce /all error:", err.message);
    res.status(err.statusCode || 500).json(
      err.statusCode === 400
        ? {
            error: "Missing required body parameters",
            details: err.message,
          }
        : {
            error: "Failed to fetch WooCommerce data",
            details: err.message,
          },
    );
  }
});

module.exports = router;
