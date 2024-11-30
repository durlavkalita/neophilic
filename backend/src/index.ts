import { connectToMongoDB } from "./config/db.config.js";
import app from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGODB_URI ||
  "mongodb://root:password@mongodb:27017/ecommerce?authSource=admin";

async function startServer() {
  try {
    await connectToMongoDB(MONGO_URI);

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
