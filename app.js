import express from "express";
import bodyParser from "body-parser";
import pg from  "pg";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const PORT = 3000;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/",(req,res)=>{
    res.render("login.ejs");
});

app.listen(PORT , (req,res) => {
    console.log(`app running on http://localhost:${PORT}`);
});