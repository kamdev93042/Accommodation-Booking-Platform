import { useState, useContext } from "react";
import { differenceInCalendarDays } from "date-fns";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [redirect, setRedirect] = useState("");

  const { user } = useContext(AuthContext);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    try {
      const bookingData = {
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        place: place._id,
        price: numberOfNights * place.price,
      };

      //  Only add user if logged in
      if (user?._id) {
        bookingData.user = user._id;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        bookingData,
        { withCredentials: true } // works for both guest & logged in
      );

      const bookingId = response.data._id;
      setRedirect(`/account/bookings/${bookingId}`);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="p-4 rounded-xl bg-white mb-1 mx-1 mt-4">
      <div className="text-xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border border-gray-300 rounded-2xl">
        <div className="flex">
          <div className="py-3 px-4 rounded-2xl">
            <label>Check in:</label>
            <input
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              type="date"
            />
          </div>
          <div className="py-3 px-4 border-l border-gray-300">
            <label>Check out:</label>
            <input
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              type="date"
            />
          </div>
        </div>

        <div className="py-3 px-4 border-t border-gray-300">
          <label>Max Guests:</label>
          <input
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
            type="number"
            className="border-gray-300"
          />
        </div>

        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t border-gray-300">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              className="border-gray-300"
            />

            <label>Phone number:</label>
            <input
              type="number"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
              className="border-gray-300"
            />

             <label>Email:</label>
            <input
              type="text"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className="border-gray-300"
            />
          </div>
        )}
      </div>

      <button
        onClick={bookThisPlace}
        className="bg-sky-600 text-white w-full p-2 rounded-2xl mt-4"
      >
        Book this place:
        {numberOfNights > 0 && <span> ${numberOfNights * place.price}</span>}
      </button>
    </div>
  );
}
