import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import frameRoutes from "./routes/frameRoutes.js";
import inquiryRoutes from "./routes/InquiryRoutes.js";
import artRoutes from "./routes/artRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();
connectDb();
dotenv.config();
app.use(express.json());
app.use(cors());
console.log(process.env.PORT);

app.use("/api/users", userRoutes);
app.use("/api/frame", frameRoutes);
app.use("/api/contact", inquiryRoutes);
app.use("/api", artRoutes);
app.use("/api/categories", categoryRoutes);
app.use(notFound);
app.use(errorHandler);
app.get("/", (req, res) => {
    res.send("api is running");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server Has Started ${PORT}`));
