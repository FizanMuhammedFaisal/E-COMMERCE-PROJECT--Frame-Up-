import express from "express";
import adminRoutes from "./adminRoutes.js";
import userRoutes from "./userRoutes.js";
import productRoutes from "./productRoutes.js";
import artistRoutes from "./artistRoutes.js";
import cartRoutes from "./cartRoutes.js";
import orderRoutes from "./orderRoutes.js";
import couponRoutes from "./couponRoutes.js";
import wishlistRoutes from "./wishlistRoutes.js";
import salesReportRoutes from "./salesReportRoutes.js";
import walletRoutes from "./walletRoutes.js";
import returnRequestRoutes from "./returnRequestRoutes.js";
import chatRoutes from "./chatRoutes.js";

const app = express.Router();

app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/artists", artistRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/wallet", walletRoutes);
app.use("/coupons", couponRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/sales-report", salesReportRoutes);
app.use("/return-request", returnRequestRoutes);
app.use("/chat", chatRoutes);
export default app;
