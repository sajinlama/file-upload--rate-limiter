import  express  from "express";
import dotenv from "dotenv";
import router from "./routes/router.js";
import cors from "cors";


dotenv.config();


const app= express();
app.use(express.json())

app.use(
  cors({
    origin: "http://localhost:5173",
     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(router);



export default app;
