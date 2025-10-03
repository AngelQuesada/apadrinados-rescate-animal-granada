import express from "express";
import config from "./config/index.js";
import errorHandler from "#middlewares/errorHandler.js";

// Routers
import wordpressRoutes from "./routes/wordpressRoutes.js";
import paypalRoutes from "./routes/paypalRoutes.js";

const app = express();

app.use(express.json());

// Rutas
app.use("/api/wordpress", wordpressRoutes);
app.use("/api/paypal", paypalRoutes);

// Manejador de errores
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
