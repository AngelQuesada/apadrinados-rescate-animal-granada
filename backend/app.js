import express from "express";
import cors from "cors";
import errorHandler from "#middlewares/errorHandler.js";

// Routers
import wordpressRoutes from "./routes/wordpressRoutes.js";
import paypalRoutes from "./routes/paypalRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

// Rutas
app.use("/api/wordpress", wordpressRoutes);
app.use("/api/paypal", paypalRoutes);
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Manejador de errores
app.use(errorHandler);

export default app;
