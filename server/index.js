import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
dotenv.config()
import errorMiddleware from './middlewares/error-middleware.js'
import cookieParser from "cookie-parser";


const app = express();
const PORT = process.env.PORT || 5404;


import userRouter from './routes/UserRouter.js';


app.use(cors({
    credentials: true,
    origin: [process.env.CLIENT_URL],
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api", userRouter)

app.use(errorMiddleware)



const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {

        })

        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        })
    } catch (e) {
        console.error(e);
    }
}

start()