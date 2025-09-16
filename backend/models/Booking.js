
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Place", 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",  
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  
  numberOfGuests :{
    type:Number,
    required:true,
  },
  name:{
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const BookingModel = mongoose.model("Booking", bookingSchema);

export default BookingModel;
