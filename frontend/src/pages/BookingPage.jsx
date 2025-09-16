import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import.meta.env.VITE_API_URL



export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
    const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     if (id) {
//       axios.get(`${import.meta.env.VITE_API_URL
// }/bookings`, { withCredentials: true })
//         .then(response => {
//           // if backend sends array directly
//           const data = Array.isArray(response.data) ? response.data : response.data.bookings;
//           const foundBooking = data.find(b => b._id === id);
//           if (foundBooking) {
//             setBooking(foundBooking);
//           }
//         })
//         .catch(err => console.error("Error fetching bookings:", err));
//     }
//   }, [id]);

  useEffect(() => {
  if (id) {
    axios.get(`${import.meta.env.VITE_API_URL}/bookings/${id}`)
      .then(res => setBooking(res.data))
      .catch(err => console.error("Error fetching booking:", err));
  }
}, [id]);


  if (!booking) {
    return <p>Loading booking...</p>;
  }

return (
  <div>
    <AccountNav />

    <div>
      {bookings?.length > 0 &&
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="p-4 mb-4 border rounded-xl shadow-sm bg-gray-100 flex gap-4 items-center"
          >
            {/* First photo from booking.place.photos */}
            {booking.place?.photos?.length > 0 && (
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/${booking.place.photos[0]}`}
                alt={booking.place.title}
                className="rounded-2xl w-44 h-44 object-cover flex-shrink-0"
              />
            )}

            {/* Booking details */}
            <div className="flex flex-col justify-between">
              <h3 className="text-xl font-bold">{booking.place?.title}</h3>
              <p className="text-gray-600">{booking.place?.address}</p>

              <p className="text-sm text-gray-700 mt-1">
                Date:{" "}
                {new Date(booking.checkIn).toLocaleDateString()} →{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </p>

              <p className="text-sm">Guests: {booking.numberOfGuests}</p>

              <div className="mt-2 font-medium">
                {differenceInCalendarDays(
                  new Date(booking.checkOut),
                  new Date(booking.checkIn)
                )}{" "}
                nights{" "}
                <span className="mx-2">|</span>
                Total Price: ${booking.price}
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>
)
}