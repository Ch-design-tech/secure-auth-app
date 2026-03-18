require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./User");

const app = express();
app.use(express.json());

// CONNECT TO MONGODB ATLAS
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// ROOT ROUTE
app.get("/", (req, res) => {
    res.send("Server is running");
});

// REGISTER
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword
        });

        await user.save();
        res.send("User registered");
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// LOGIN 
app.post("/login", async (req, res) => {
    console.log("BODY:", req.body);
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).send("User not found");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).send("Invalid password");

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// AUTH MIDDLEWARE 
function auth(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) return res.status(403).send("Access denied");

    const token = authHeader.split(" ")[1]; 

    if (!token) return res.status(403).send("Token missing");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch {
        res.status(400).send("Invalid token");
    }
}

// PROTECTED ROUTE
app.get("/dashboard", auth, (req, res) => {
    res.send("Secure data");
});

// START SERVER
app.listen(3000, () => {
    console.log("Server running on port 3000");
});