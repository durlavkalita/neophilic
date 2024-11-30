import { connectToMongoDB } from "./config/db.config.js";
import app from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 5000;
connectToMongoDB();

async function startServer() {
  try {
    connectToMongoDB();
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
