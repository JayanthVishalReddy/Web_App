const express=require('express');
const app=express();
require("dotenv").config();
const morgan=require("morgan");
const { errorHandler } = require('./middlewares/errorHandler');
const cors=require('cors');
require("express-async-errors");
require("./db");
const userRoute=require('./router/user');
const actorRoute=require('./router/actor');
const movieRouter = require("./router/movie");
const reviewRouter = require("./router/review");
const adminRouter = require("./router/admin");
const { handleNotFound } = require('./utilities/helper');
app.use(cors());
app.use(express.json()); 
app.use(morgan("dev"));
app.use("/api", userRoute);
app.use("/api/actor",actorRoute);
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);
app.use('/*', handleNotFound);
app.use(errorHandler)

app.get("/about",(req,res)=>{
    res.send("<h1>Hello I am from your backend server About</h1>");
});
app.listen(8000,()=>{
    console.log("The port is listening on port 8000");
})