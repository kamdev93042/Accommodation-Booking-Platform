import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import imageDownloader from 'image-downloader';
import multer from "multer";

import path from "path";
import { fileURLToPath } from "url";
import Place from "./models/Place.js";
import Booking from "./models/Booking.js";


const BACKEND_URL = process.env.BACKEND_URL;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); 

const jwt_SECRET = process.env.JWT_SECRET;

const app = express();

app.use(express.json()); // parse JSON body
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
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
    secure: t, 
    sameSite: "none"
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



app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: path.join(__dirname, 'uploads', newName),
  });
  res.json([{
    originalname: newName,               // no original name from URL, so reuse filename
    filename: newName,
   url: `${BACKEND_URL}/uploads/${newName}`,
  }]);
});




const photosMiddleware = multer({ dest: 'uploads/' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = req.files.map(file => ({
    originalname: file.originalname,
    filename: file.filename,
    url: `${BACKEND_URL}/uploads/${newName}`
  }));

  res.json(uploadedFiles);
});



app.post("/places", async (req, res) => {
  try {
    const { token } = req.cookies;
    const userData = jwt.verify(token, jwt_SECRET); 
    const {
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;

    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });

    res.json(placeDoc);
  } catch (err) {
    console.error("Error in POST /places:", err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/user-places',async (req, res) => {
   const { token } = req.cookies;
    jwt.verify(token, jwt_SECRET, {}, async (err, userData) => {
      const {id} = userData;
      res.json(await Place.find({owner:id}) );
    });
});

app.get('/places/:id',async (req, res) =>{
  const {id} = req.params;
  res.json(await Place.findById(id));  
})


app.put('/places', async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // verify user
    const userData = jwt.verify(token, jwt_SECRET);
    const {
      id,
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;

    // find the place
    const placeDoc = await Place.findById(id);
    if (!placeDoc) {
      return res.status(404).json({ message: "Place not found" });
    }

    // check ownership
    if (placeDoc.owner.toString() !== userData.id) {
      return res.status(403).json({ message: "You are not the owner of this place" });
    }

    // update fields
    placeDoc.set({
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });

    await placeDoc.save();

    res.json({ message: "Place updated successfully", place: placeDoc });
  } catch (err) {
    console.error("Error updating place:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/places", async (req, res) => {
  res.json( await Place.find() );
})


app.post("/bookings", async (req, res) => {
  try {
    const { place, checkIn, checkOut, numberOfGuests, name, phone, price, user } = req.body;

    const booking = await Booking.create({
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
      user,   //now backend uses the user sent from frontend
    });

    res.json(booking);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Failed to create booking", details: err.message });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const userData = jwt.verify(token, jwt_SECRET);

    const bookings = await Booking.find({ user: userData.id }).populate("place");

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings", details: err.message });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
