const express = require("express");
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const router = express.Router();

function validateWooCredentials(body) {
  const { url, consumerKey, consumerSecret } = body || {};

  const missing = [];
  if (!url) missing.push("url");
  if (!consumerKey) missing.push("consumerKey");
  if (!consumerSecret) missing.push("consumerSecret");

  if (missing.length) {
    const error = new Error(
      `Missing WooCommerce credentials: ${missing.join(
        ", ",
      )}. Expected url, consumerKey, consumerSecret in request body.`,
    );
    error.statusCode = 400;
    throw error;
  }

  return { url, consumerKey, consumerSecret };
}

function createWooApi({ url, consumerKey, consumerSecret }) {
  return new WooCommerceRestApi({
    url,
    consumerKey,
    consumerSecret,
    version: "wc/v3",
  });
}

async function getAllData(api) {
  try {
    const perPage = 100;
    let page = 1;
    let allData = [];

    while (true) {
      const response = await api.get("data", {
        per_page: perPage,
        page,
      });

      const items = response.data;
      allData = allData.concat(items);

      if (items.length < perPage) {
        break;
      }

      page += 1;
    }

    return allData;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
}

router.post("/all", async (req, res) => {
  console.log(req.body);
  try {
    const creds = validateWooCredentials(req.body);
    const api = createWooApi(creds);
    const data = await getAllData(api);
    res.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      message: "Failed to fetch WooCommerce data",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
