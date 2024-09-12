import mongoose from "mongoose";
import app from "./app";
import config from "./config";

async function main() {
  try {
    // Connect to the database
    await mongoose.connect(config.db_url as string);
    console.log("Database connected. 🎁");

    // Start the server
    app.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port} ...🏃...`);
    });
  } catch (error) {
    console.error("Error occurred while starting the server:", error);
    process.exit(1); // Exit the process with a failure code
  }
}




main();
