import dotenv from "dotenv";
dotenv.config();
import express, {Express, Request, Response} from "express"
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import { error } from "console";
import router from "router";
const app:Express=express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

const server= http.createServer(app);

const port = process.env.PORT;
server.listen(port,()=>{
    console.log("Server is running on port 3000");
});

const db_uri=process.env.DB_URI;

mongoose.Promise=Promise;
mongoose.connect(db_uri).then(()=>console.log("Database Connect!"));
mongoose.connection.on('error', (error:Error)=> console.log(error));

app.use('/', router())