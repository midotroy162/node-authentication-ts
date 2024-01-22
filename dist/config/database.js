"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "config.env" });
const DB_URL = process.env.DB_URL || "";
function dbConnection() {
    mongoose_1.default
        .connect(DB_URL)
        .then((conn) => {
        console.log(conn.connection.host);
    })
        .catch((err) => {
        console.log(err);
        process.exit(1);
    });
}
exports.default = dbConnection;
