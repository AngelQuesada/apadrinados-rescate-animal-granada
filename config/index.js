require("dotenv").config();
const db = require("./db");

const config = {
  port: process.env.PORT,
  db,
  paypal: {
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
    sandbox_client_id: process.env.SANDBOX_PAYPAL_CLIENT_ID,
    sandbox_client_secret: process.env.SANDBOX_PAYPAL_CLIENT_SECRET,
    live_mode: process.env.PAYPAL_LIVE_MODE === "true" ? true : false,
  },
  wordpress: {
    url: process.env.WORDPRESS_URL,
    user: process.env.WORDPRESS_USER,
    password: process.env.WORDPRESS_PASSWORD,
  },
};

module.exports = config;
