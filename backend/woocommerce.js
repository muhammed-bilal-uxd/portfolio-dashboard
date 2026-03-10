const express = require("express");
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const router = express.Router();

const { WEBSITE_URL, CONSUMER_KEY, CONSUMER_SECRET } = process.env;

const woocommerceApi = new WooCommerceRestApi({
  url: WEBSITE_URL,
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
  version: "wc/v3",
});

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

async function getAllProducts() {
  const response = await woocommerceApi.get("products", {
    per_page: null,
  });
  return response.data;
}

async function getAllCategories() {
  const response = await woocommerceApi.get("products/categories", {
    per_page: 100,
  });
  return response.data;
}

router.get("/all", async (req, res) => {
  try {
    const data = await getAllProducts();
    res.json({
      status: res.status,
      data: data,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      message: "Failed to fetch WooCommerce data",
      error: error.response?.data || error.message,
    });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const data = await getAllCategories();
    res.json({
      status: res.status,
      data: data,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      message: "Failed to fetch WooCommerce categories",
      error: error.response?.data || error.message,
    });
  }
});

router.post("/all-data", async (req, res) => {
  console.log(req.body);
  try {
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
