import { useEffect, useState } from "react";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import.meta.env.VITE_API_URL


export default function PlacesFormPage(){
    const {id} = useParams();
    
    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [description,setDescription] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [perks,setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [maxGuests,setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);
    const [price, setPrice] = useState(100);

    useEffect(() => {
        if(!id) {
            return;
        }
        axios.get(`${import.meta.env.VITE_API_URL
}/places/` + id).then(res => {
            const { data } = res;
            setTitle(data.title);
            setAddress(data.address);
            setDescription(data.description);
            setAddedPhotos(data.photos || []);  
            setPerks(data.perks || []);
            setExtraInfo(data.extraInfo || "");
            setCheckIn(data.checkIn || "");
            setCheckOut(data.checkOut || "");
            setMaxGuests(data.maxGuests || 1);
            setPrice(data.price);
        });


    }, [id]); 

    function inputHeader(text){
        return ( 
            <h2 className="text-xl mt-4">{text}</h2>
        ) 
    }

    function inputDescription(text){
        return(
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    function preInput(header, description){
        return (
            <>
              {inputHeader(header)}
              {inputDescription(description)}
            </>
        )
    }

    async function savePlace(ev){
        ev.preventDefault();
        const placeData = {
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
           checkOut,
           maxGuests,
           price,
        };
        if(id) {
            //update
             await axios.put(`${import.meta.env.VITE_API_URL
}/places`, {
                id, ...placeData
        });
        setRedirect(true);
        } else{
            //new place
            await axios.post(`${import.meta.env.VITE_API_URL
}/places`, placeData
        );

        setRedirect(true);
        }
    }

    if(redirect) {
        return <Navigate to={'/account/places'} />
    }

    return(
            <div> 
                <AccountNav />
                    <form onSubmit={savePlace}>
                        {preInput('Title', 'title for your place, should be short and catchy as in advertisement' )}
                        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: My lovely apt" />

                        {preInput('Address', 'address to this place')}
                        <input type="text" 
                        value={address} 
                        onChange={ev => setAddress(ev.target.value)} 
                        placeholder="address"/>

                        {preInput('Photos', 'more = better')}
                        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                        

                        {preInput('Description','descripton of the place')}
                        <textarea value={description} 
                        onChange={ev => setDescription(ev.target.value)}
                        className=" w-full border my-2 px-3 py-3 rounded-2xl"/>

                        {/*perks*/}
                        {preInput('Perks', 'select all the perks')}
                       
                        <div className="gap-2 mt-2 grid grid-cols-2 md:grid-cols-4  lg:grid-cols-6">
                            <Perks selected={perks} onChange={setPerks} />
                        </div>
                        {preInput('Extra Info', 'house rules, etc')}
                        <textarea value={extraInfo} 
                        onChange={ev => setExtraInfo(ev.target.value)}
                        className="w-full border my-2 px-3 py-3 rounded-2xl"/>

                        {preInput('Check in&out times', 'add check and check out times, remember to have some window for cleaning the room between guests')}
                        <div className="grid gap-1 grid-cols-2 md:grid-cols-4 ">
                            <div>
                                <h3 className="mt-2 -mb-1">Check in time</h3>
                                <input type="text" 
                                value={checkIn}
                                onChange={ev => setCheckIn(ev.target.value)}
                                placeholder="14" />
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Check out time</h3>
                                <input type="text"
                                value={checkOut} 
                                onChange={ev => setCheckOut(ev.target.value)}
                                
                                placeholder="11"/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                                <input type="number"
                                value={maxGuests}
                                onChange={ev => setMaxGuests(ev.target.value)}
                                 />
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Price per night</h3>
                                <input type="number"
                                value={price}
                                onChange={ev => setPrice(ev.target.value)}
                                 />
                            </div>
                        </div>
                        <button className="bg-sky-600 text-white w-full p-2 rounded-2xl my-4">Save</button>
                    </form>
            </div>
    );
}