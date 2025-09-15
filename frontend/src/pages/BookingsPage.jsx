import { useState, useEffect } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import { differenceInCalendarDays } from "date-fns";
import.meta.env.VITE_API_URL


export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL
}/bookings`, { withCredentials: true })
      .then(res => setBookings(res.data))
      .catch(err => console.log("Error fetching bookings:", err));
  }, []);

  return (
    <div>
      <AccountNav />

      <div>
        {bookings?.length > 0 &&
          bookings.map(booking => (
            <div
              key={booking._id}
              className="p-4 mb-4 border rounded-xl shadow-sm bg-gray-100 flex gap-4"
            >
              {/*how first photo from booking.place.photos */}
              {booking.place?.photos?.length > 0 && (
                <img
                  src={`http://localhost:4000/uploads/${booking.place.photos[0]}`}
                  alt={booking.place.title}
                  className="rounded-2xl w-44 h-44 object-cover"
                />
              )}

              <div>
                <h3 className="text-xl font-bold">{booking.place?.title}</h3>
                <p>{booking.place?.address}</p>
                <p>
                  Date:{" "}
                  {new Date(booking.checkIn).toLocaleDateString()} →{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>
                <p>Guests: {booking.numberOfGuests}</p>
                <div>
                {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} {' '} 
                    nights  | Total Price: ${booking.price}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
