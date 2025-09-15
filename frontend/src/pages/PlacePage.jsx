import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";
import.meta.env.VITE_API_URL


export default function PlacePage() {
    const{id} = useParams();
    const [place, setPlace] = useState(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    useEffect(() => {
        if(!id) {
            return;
        }
        axios.get(`${import.meta.env.VITE_API_URL
}/places/${id}`).then(response =>{
            setPlace(response.data);
        })

    }, [id]);
    
    if(!place) return;

    //showing photos after clicikng on more photos
    if(showAllPhotos) {
        return (
            <div className="absolute bg-black text-white inset-0 min-h-screen">
                <div className="p-8 grid bg-black">
                    <div>
                        <h2 className="text-3xl">Photos of {place.title}</h2>
                        <button onClick={() => setShowAllPhotos(false)} className="fixed flex gap-1 py-2 px-3 bg-white text-black rounded-xl shadow shadow-black right-10 top-14 hover:bg-gray-400">
                        
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                              Close photos
                        </button>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map(photo =>(
                    <div className="mt-8">
                        <img src={`${import.meta.env.VITE_API_URL
}/uploads/`+photo}
                        alt="" />
                    </div>
                ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 bg-gray-100 py-6">
            <h1 className="text-2xl">{place.title}</h1>
            <a className=" flex gap-1 mt-2 underline font-semibold w-fit items-center" target="_blank" href={"https://maps.google.com/?q="+place.address}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {place.address}
            </a>

            <div className="relative">
                <div className="mt-2 grid gap-2 grid-cols-[2fr_1fr] rounded-2xl overflow-hidden">
                <div>
                    {place.photos?.[0] && (
                        <div>
                             <img
                             onClick={() => setShowAllPhotos(true)} 
                             className="aspect-square w-full h-full object-cover cursor-pointer"
                             src={`${import.meta.env.VITE_API_URL
}/uploads/${place.photos[0]}`} 
                          alt=""/>
                        </div>
                    )}
                </div>

                <div className="grid grid-rows-2">
                    {place.photos?.[1] && (
                          <img
                          onClick={() => setShowAllPhotos(true)} 
                          className="aspect-square w-full h-full object-cover cursor-pointer  "
                           src={`${import.meta.env.VITE_API_URL
}/uploads/${place.photos[1]}`} 
                          alt=""/>
                    
                    )}
                    <div className="overflow-hidden">
                        {place.photos?.[2] && (
                          <img 
                          onClick={() => setShowAllPhotos(true)} 
                          className="aspect-square w-full h-full object-cover cursor-pointer  relative top-2"
                          src={`${import.meta.env.VITE_API_URL
}/uploads/${place.photos[2]}`} 
                          alt=""
                          />
                    
                    )}
                    </div>
                </div>
            </div>
            <button onClick={() => setShowAllPhotos(true) } className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-gray-500">
                
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg> 
                Show more photos
            </button>

            </div>
        
            <div className="mt-6 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
                
                <div>
                    <div className="my-4">
                <h2 className="font-semibold text-2xl ">Description</h2>
                {place.description}
                </div>
                    Check-in: {place.checkIn} <br/>
                    Check-out: {place.checkOut} <br />
                    Max number of guests: {place.maxGuests}
                
                </div>
                <div>
                    <BookingWidget place={place} />
                </div>
            </div>
          <div className="bg-white py-8">
             <div>
                 <h2 className="mt-2 font-semibold text-2xl ">Extra Info</h2>
            </div>
               <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{place.extraInfo}</div>
          </div>
        </div>
    );
}