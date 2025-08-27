import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function registerUser(ev){ //creating this function to register any user by doing request to the api

        ev.preventDefault(); //It will not reload the page 
        try{
            await axios.post('http://localhost:4000/register', {
            name,
            email,
            password,
        });
         alert('Registration successful, Now you can log in');
        }catch(error){
            alert('Registration failed! please try again later');
        }
    }


    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-3xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto " onSubmit={registerUser}> {/*onSubmit form we need to just grab the event and run preventDefault it will not reload the page*/}
                    <input type="text" 
                    placeholder="John Doe" 
                    value={name} 
                    onChange={ev => setName(ev.target.value)}  />

                    <input type="email" 
                    placeholder="your@email.com" 
                    value={email} 
                    onChange={(ev) => setEmail(ev.target.value)} />

                    <input type="password" 
                    placeholder="password" 
                    value={password} 
                    onChange={ev=> setPassword(ev.target.value)}/>

                    <button className="bg-sky-600 text-white w-full p-2 rounded-2xl">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already an account?
                        <Link className="underline text-black" to={'/login'}> Login now</Link>
                    </div>
              </form>
            </div>
        </div>
    );
} 