import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "config.env" });
const DB_URL: string = process.env.DB_URL || "";
function dbConnection(): void {
  mongoose
    .connect(DB_URL)
    .then((conn) => {
      console.log(conn.connection.host);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
}
export default dbConnection;
