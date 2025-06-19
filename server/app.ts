import express, { NextFunction, Request,Response } from "express";
export const app= express();
import cors from "cors";
import cookieParser from "cookie-parser";
import {ErrorMiddleware} from "./middleware/error";
import userRouter from "./routes/user.route";



require('dotenv').config();
//body parser
app.use(express.json({limit:"50mb"})); //imp for using cloudinary

//cookie parser- sending cookie from frontend OR add something in cookie in frontend from backend
app.use(cookieParser());

//cors => Cross Origin Resource Sharing
// IF WE DONT ADD CORS- suppose we are making an api and adding only to our websiite, if someone wants to hit our api from other URL or server they can hit it
// IF WE ADD- can add property to specify that from which origin we can hit the api(our websites link)
app.use(cors({origin:["http://localhost:3000"]}));


//routes

app.use("/api/v1",userRouter);

//testing our api
app.get("/test",(req:Request,res:Response,next:NextFunction) =>
{
    res.status(200).json({success:true,message:"API is working"})
});

//unknown route
app.all("*",(req:Request,res:Response,next:NextFunction)=>
{
    const err = new Error(`Route ${req.originalUrl} not Found`) as any;
    err.statusCode=404;
    next(err);
});

app.use(ErrorMiddleware);