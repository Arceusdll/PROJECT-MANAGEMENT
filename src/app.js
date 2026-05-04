import express from "express"
import cors from "cors"






const app = express();
// # Basic configuration for express app 
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true , limit:"16kb"}));
app.use(express.static("public"));

app.use(cookieParser());

app.use(cors(
    {
        origin :process.env.CORS_ORIGIN?.split(",") || "http://localhost:5000",
        credentials : true,
        methods:["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
        allowedHeaders:["Content-Type","Authorization"]
    }
));

import healthCheckRouter from "./routes/healthcheck.routes.js";
import authrouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";

import projectRouter from "./routes/project.routes.js";
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth/", authrouter);
app.use("/api/v1/projects",projectRouter);


app.get('/', (req, res) => {
  res.send('Goo khalo!')
});

app.get("/instagram",(req,res)=>{
    res.send("This is Instagram page")
});

export default app;