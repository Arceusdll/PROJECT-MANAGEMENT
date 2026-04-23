import dotenv from "dotenv";
import dns from "node:dns/promises";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({ path: "./.env" });

dns.setServers(["1.1.1.1", "1.0.0.1"]);

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("Database Successfully connected 👊");

    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(`MongoDb Connection failed: ${error}`);
  });