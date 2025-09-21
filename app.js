const express = require("express");
const app = express();
const config = require("./config");

// Routes-----
const wordpressRoutes = require("./routes/wordpressRoutes");
const paypalRoutes = require("./routes/paypalRoutes");

app.use(express.json());

app.use("/api/wordpress", wordpressRoutes);
app.use("/api/paypal", paypalRoutes);

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
