import { createContext, useState, useEffect } from "react";
import axios from "axios";
import.meta.env.VITE_API_URL


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL
}/profile`, { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  //  logout function
  const logout = async () => {
    await axios.post(`${import.meta.env.VITE_API_URL
}/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  if (loading) {
    return <p>Loading...</p>; // optional loader
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
