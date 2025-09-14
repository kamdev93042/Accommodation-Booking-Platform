import './App.css'
import { Route, Routes } from "react-router-dom";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';
import ProtectedRoute from './component/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import PlacesPage from './pages/PlacesPage';
import PlacesFormPage from  './pages/PlacesFormPage';
import PlacePage from './pages/PlacePage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';

axios.defaults.withCredentials = true;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
        {/* Public homepage */}
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/place/:id' element = {<PlacePage /> } />

        {/* Protected routes */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
        path="/account/places"
        element={
        <ProtectedRoute>
          <PlacesPage />
        </ProtectedRoute>
        }/>

         <Route
        path="/account/places/new"
        element={
        <ProtectedRoute>
          <PlacesFormPage />
        </ProtectedRoute>
        }/>

        <Route
        path="/account/places/:id"
        element={
        <ProtectedRoute>
          <PlacesFormPage />
        </ProtectedRoute>
        }/>

         <Route
        path="/account/bookings"
        element={
        <ProtectedRoute>
          <BookingsPage />
        </ProtectedRoute>
        }/>

         <Route
        path="/account/bookings/:id"
        element={
        <ProtectedRoute>
          <BookingPage />
        </ProtectedRoute>
        }/>
        
      </Route>
    </Routes>
  );
}

export default App;
