import { useState } from "react";
import {differenceInCalendarDays} from "date-fns";
import { Navigate } from "react-router-dom";
import axios from "axios";
import.meta.env.VITE_API_URL


import { AuthContext } from "./AuthContext";
import { useContext } from "react";

export default function BookingWidget({place}) {
    const [checkIn, setCheckIn] = useState('');
    const[checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone , setPhone] = useState('');
    const [redirect, setRedirect] = useState('');

    const {user}  = useContext(AuthContext);

    let numberOfNights = 0;
    if(checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));

    }

    async function bookThisPlace() {
        const response = await axios.post(`${import.meta.env.VITE_API_URL
}/bookings`, {
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            place: place._id,
            price: numberOfNights * place.price,
            user: user._id,   //  logged-in user ID from context
            });
            const bookingId = response.data._id;
            setRedirect(`/account/bookings/${bookingId}`);
        }


    if(redirect) {
        return <Navigate to={redirect} />
    }
     
    return(
        <div className=" p-4 rounded-xl bg-white mb-1 mx-1 mt-4">
                        <div className="text-xl text-center">
                            Price: ${place.price} / per night
                        </div>
                       <div className="border border-gray-300 rounded-2xl">
                         <div className="flex">
                            <div className=" py-3 px-4 rounded-2xl">
                            <label>Check in:</label>
                            <input
                            value={checkIn}
                            onChange={ev => setCheckIn(ev.target.value)}     
                              type="date" />
                        </div>
                        <div className="py-3 px-4 border-l border-gray-300">
                            <label>Check out:</label>
                            <input
                            value={checkOut}
                            onChange={ev => setCheckOut(ev.target.value)}     
                             type="date" />
                        </div>
                         </div>
                         <div className="py-3 px-4 border-t border-gray-300">
                            <label>Max Guests:</label>
                            <input
                             value={numberOfGuests}
                            onChange={ev => setNumberOfGuests(ev.target.value)}     
                             type="number" className="border-gray-300" />
                        </div>
                        {numberOfNights > 0 && (
                            <div className="py-3 px-4 border-t border-gray-300">
                            <label>Your full name:</label>
                            <input
                            type ='text'
                             value={name}
                            onChange={ev => setName(ev.target.value)}     
                
                            className="border-gray-300" />

                            <label>Phone number:</label>
                            <input
                            type ='number'
                             value={phone}
                            onChange={ev => setPhone(ev.target.value)}     
    
                            className="border-gray-300" />
                        </div>
                        )}
                       </div>
                       <button onClick={bookThisPlace} className="bg-sky-600 text-white w-full p-2 rounded-2xl mt-4">
                        Book this place:
                        {numberOfNights > 0 && (
                            <span> ${numberOfNights * place.price}</span>
                        )}
                        </button>
                    </div>
    );
}