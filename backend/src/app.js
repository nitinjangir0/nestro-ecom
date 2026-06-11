import 'dotenv/config'
import express from "express";
import cors from "cors";
const server = express();
import connectDB from './config/connectDB.js';
//Router import
import categoryRouter from './routers/category.router.js';
import roomRouter from './routers/room.router.js';

server.use(express.json());
server.use(cors({origin: "http://localhost:3000" }));
server.use("/api/category", categoryRouter)
server.use("/api/room-type", roomRouter)

connectDB()   
server.listen(process.env.PORT,() => {
    console.log("server is runnig on port 5000");  
})