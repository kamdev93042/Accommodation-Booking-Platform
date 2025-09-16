
import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema({
//   place: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "Place", 
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "User",  
//   },
//   checkIn: {
//     type: Date,
//     required: true,
//   },
//   checkOut: {
//     type: Date,
//     required: true,
//   },
  
//   numberOfGuests :{
//     type:Number,
//     required:true,
//   },
//   name:{
//     type: String,
//     required: true,
//     trim: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
// });
const bookingSchema = new mongoose.Schema({
  place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
  checkIn: Date,
  checkOut: Date,
  numberOfGuests: Number,
  name: String,
  phone: String,
  email: String,   // optional but useful
  price: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null } // logged-in user OR null
});


const BookingModel = mongoose.model("Booking", bookingSchema);

export default BookingModel;
