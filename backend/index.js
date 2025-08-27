import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";




dotenv.config(); 

const jwt_SECRET = process.env.JWT_SECRET;


const app = express();

app.use(express.json()); // parse JSON body
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(" MongoDB connection error:", err));

// Routes
app.get("/test", (req, res) => {
  res.json("Hello from backend!");
});


app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); //hashing password 

    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
     });
   
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "User already exists or invalid data" });
  }
});



app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (!userDoc) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, userDoc.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
  { id: userDoc._id, 
    email: userDoc.email },
  jwt_SECRET,
  { expiresIn: "1h" }
);
res
  .cookie("token", token, {
    httpOnly: true,  // frontend JS cannot access it
    secure: false, 
    sameSite: "lax"
  })
  .status(200)
  .json({ message: "Login successful" });
});


app.get("/profile", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, jwt_SECRET, {}, async (err, userData) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    const userDoc =  await User.findById(userData.id);
    res.json(userDoc); // send user info
  });
});


app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});




const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
