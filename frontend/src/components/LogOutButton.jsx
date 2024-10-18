import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

const LogOutButton = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('icon');
        localStorage.removeItem('adsBlocked');  // Remove adsBlocked state
        navigate("/?logout=true");
    }
    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default LogOutButton
