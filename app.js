import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const PORT = 3000;
const app = express();

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
await db.connect();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("login.ejs");
});

app.get("/signup",(req,res)=>{
    res.render("signup.ejs");
});

app.post("/signup", async(req, res) => {

    console.log("BODY:", req.body);
    console.log("PASSWORD:", req.body.password);
    console.log("PASSWORD TYPE:", typeof req.body.password);


    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await db.query(
        "INSERT INTO users (user_email, password) VALUES ($1, $2)",
        [req.body.email, hashedPassword]
    );
    res.redirect("/");
});

app.post("/login", async (req, res) => {
    const result = await db.query(
        "SELECT user_email, password FROM users WHERE user_email = $1",
        [req.body.email]
    );

    if (result.rows.length === 0) {
        console.log("User not found");
        return res.redirect("/");
    }

    const user = result.rows[0];

    const passwordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (passwordCorrect) {
        console.log("Login successful!");
        res.render("index.ejs");
    } else {
        console.log("Wrong password!");
        res.redirect("/");
    }
});

app.listen(PORT, (req, res) => {
    console.log(`app running on http://localhost:${PORT}`);
});