import app from "./app.js";
import config from "./config/index.js";

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
