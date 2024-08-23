import React, { useState } from 'react';
import './css/LoginPage.css'
import { FaUser, FaLock } from "react-icons/fa";
import logo from"../images/PriceHound_Logo.png";
function LoginPage() {

    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const handleLogin = (event) => {
        event.preventDefault();
        alert(Email + " " + Password);
    };
    return (
        <div className='center'>
            <div className='loginDetails'>
                <img src={logo}/>
                <h1>Login</h1>
                <form onSubmit={handleLogin} className='loginForm'>
                    <FaUser />
                    <input type='email' onChange={(e) => setEmail(e.target.value)} required className="formInput" placeholder='Enter your email'></input>
                    <input type='password' onChange={(e) => setPassword(e.target.value)} required className="formInput" placeholder='Enter your password'></input>
                    <button type='submit' className="formButton">Login</button>
                    <button type='button' className="gButton">Sign in with Google</button>
                </form>

                <p><a className='link'>Forgot password?</a></p> <p>Dont have an account? <a className='link'>Create an account</a></p>
            </div>
        </div>
    )
}

export default LoginPage
