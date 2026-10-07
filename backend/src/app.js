import 'dotenv/config'
import express from "express";
import cors from "cors";
const server = express();
import connectDB from './config/connectDB.js';
//Router import
import categoryRouter from './routers/category.router.js';
import roomRouter from './routers/room.router.js';
import productRouter from './routers/product.router.js';
import userRouter from './routers/user.router.js';
import cartRouter from './routers/cart.router.js';
import orderRouter from "./routers/order.router.js";
import wishlistRouter from "./routers/wishlist.router.js";


import dashboardRouter from "./routers/dashboard.router.js";
import cookieParser from "cookie-parser";


server.use(cookieParser());
server.use(express.json());
const allowedOrigins = [
    "http://localhost:3000",
    "https://nestro-ecom.vercel.app"
];

server.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);
server.use("/api/category", categoryRouter)
server.use("/api/room-type", roomRouter)
server.use("/api/product", productRouter)
server.use("/api/user", userRouter)
server.use("/api/cart", cartRouter)
server.use("/api/order", orderRouter);
server.use("/api/wishlist", wishlistRouter);

server.use("/api/dashboard", dashboardRouter);

connectDB()   
server.listen(process.env.PORT,() => {
    console.log("server is runnig on port 5000");  
})