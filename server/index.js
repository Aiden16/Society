import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan"; //morgan is a Node. js and Express middleware to log HTTP requests and errors, and simplifies the process
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; //Multer is a node. js middleware for handling multipart/form-data , which is primarily used for uploading files
import helmet from "helmet"; // Helmet helps you secure your Express apps by setting various HTTP headers
import path from "path";
import { fileURLToPath } from "url"; //help sets path when configure directories
import authRoutes from "./routes/auth.js";
import {register} from "./controllers/auth.js";


/*CONFIGURATION*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common")); 
app.use(bodyParser.json({ limit:"30mb", extended:true }));
app.use(bodyParser.urlencoded({ limit:"30mb" , extended:true }));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets'))); //local storage for images


/*FILE STORAGE*/

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
})

const upload = multer({ storage });

/*ROUTES WITH FILES*/
app.post("/auth/register",upload.single("picture"),register)

/*ROUTES*/
app.use("/auth",authRoutes) //prefix of auth for authRoutes

/*MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server running on : ${PORT}`);
    })
}).catch((error)=>console.log(`${error} did not connect..`))

