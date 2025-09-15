import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import.meta.env.VITE_API_URL


export default function IndexPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL
}/places`).then((response) => {
      setPlaces(response.data);
    });
  }, []);

  return (
    <>
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {places.length > 0 &&
        places.map((place) => (
           <Link key={place._id} to={'/place/'+place._id}> 
            <div  className="mb-2">
            {place.photos?.[0] && (
              <img
                src={`http://localhost:4000/uploads/${place.photos[0]}`}
                alt={place.title}
                className="rounded-2xl size-60 object-cover"
                
              />
            )}
            
            <h3 className="font-bold ">{place.address}</h3>
            <h2 className="text-sm text-gray-500 ">{place.title}</h2>
            <h3 className="mt-1 text-sm italic font-semibold">${place.price} per night</h3>
          </div>
          </Link>    
        ))}
        
    </div>
    </>
    
  );
}
