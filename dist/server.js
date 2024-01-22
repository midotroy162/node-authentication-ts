"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = __importDefault(require("./config/database"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const apiError_1 = __importDefault(require("./utils/apiError"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
dotenv_1.default.config({ path: "config.env" });
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
    console.log(`mode :  ${process.env.NODE_ENV}`);
}
//Mount Routes
app.use("/api/v1/users", userRoute_1.default);
app.use("/api/v1/auth", authRoute_1.default);
app.all("*", (req, res, next) => {
    // create error and send it to error handling middleware
    // const err = new Error("cant find this route:"+ req.originalUrl);
    // next(err.message);
    next(new apiError_1.default(`cant find this route:${req.url}`, 400));
});
app.use(errorMiddleware_1.default.globalError);
const PORT = parseInt(process.env.PORT, 10);
app.listen(PORT, () => {
    console.log(`app is Running on port ${PORT}`);
    (0, database_1.default)();
});
