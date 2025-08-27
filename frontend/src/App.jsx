import './App.css'
import { Route, Routes } from "react-router-dom";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';
import ProtectedRoute from './component/ProtectedRoute';
import AccountPage from './pages/AccountPage';

axios.defaults.withCredentials = true;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
        {/* Public homepage */}
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/account/:subpage?"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />

        <Route
        path="/account/:subpage/:action"
        element={
        <ProtectedRoute>
          <AccountPage />
        </ProtectedRoute>
        }/>
        
      </Route>
    </Routes>
  );
}

export default App;
