import { Link, Navigate } from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";


export default function LoginPage() {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const [redirect, setRedirect] = useState();

    const { setUser } = useContext(AuthContext);

    async function loginUser(ev) {
        ev.preventDefault();

        try {
            await axios.post("http://localhost:4000/login", { email, password }, { withCredentials: true });
            // Fetch profile immediately after login
            const { data } = await axios.get("http://localhost:4000/profile", { withCredentials: true });
            setUser(data);
             alert("Login successful");
             setRedirect(true);
            } catch {
                alert("Login failed");
            }
        }

    if(redirect){
        return <Navigate to = {'/'}/>
    }


    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-3xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto " onSubmit={loginUser}>

                    <input type="email" 
                    placeholder="your@email.com"
                    value={email}
                    onChange={ev => setEmail(ev.target.value)}
                    />

                    <input type="password" 
                    placeholder="password"
                    value={password}
                    onChange={ev=> setPassword(ev.target.value)}
                     />

                    <button className="bg-sky-600 text-white w-full p-2 rounded-2xl">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet?
                        <Link className="underline text-black" to={'/register'}> Register now</Link>
                    </div>
              </form>
            </div>
        </div>
    );
}