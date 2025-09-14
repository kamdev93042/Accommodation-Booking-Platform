import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import {useParams, useNavigate } from "react-router-dom";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

export default function ProfilePage() {
  const { loading, user, logout } = useContext(AuthContext);
  const { subpage } = useParams();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;

  const activePage = subpage || "profile";


  const handleLogout = async () => {
    await logout();
    alert("Logout successfully!");
    navigate("/"); //redirect to the homepage
  };

  return (
    <div>
      <AccountNav />

      {activePage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user?.name} ({user?.email}) <br />
          <button
            onClick={handleLogout}
            className="bg-sky-600 text-white w-full p-2 rounded-2xl max-w-sm mt-2"
          >
            Logout
          </button>
        </div>
      )}
      {subpage === 'places' && (
        <PlacesPage />
      )}


    </div>
  );
}
