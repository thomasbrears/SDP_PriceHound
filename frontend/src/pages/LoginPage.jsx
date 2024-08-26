import React, { useState } from 'react';
import '../css/LoginPage.css';
import { FaUser } from "react-icons/fa";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../FirebaseAuth/Firebase.js';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const HandleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential)
            const user = userCredential.user;
            localStorage.setItem('token', user.accessToken)
            localStorage.setItem('user', JSON.stringify(user))
            alert("your uid is "+ user.uid)
            navigate("/")
        } catch (error) {
            alert("not a valid account");
        }
    }
    const handleGoogle = async (e) => {
        e.preventDefault();
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            localStorage.setItem('token', user.accessToken)
            localStorage.setItem('user', JSON.stringify(user))
            navigate("/")
        } catch (error) {

            }
    }
    return (
        <div className='center'>
            <div className='loginDetails'>
                <img src="/images/PriceHound_Logo.png" alt='profilehead' />
                <h1>Login</h1>
                <form onSubmit={HandleSubmit} className='loginForm'>
                    <FaUser />
                    <input type='email' onChange={(e) => setEmail(e.target.value)} required className="formInput" placeholder='Enter your email'></input>
                    <input type='password' onChange={(e) => setPassword(e.target.value)} required className="formInput" placeholder='Enter your password'></input>
                    <button type='submit' className="formButton">Login</button>
                    <button type='button' className="gButton" onClick={handleGoogle}>Sign in with Google</button>
                </form>
                <p><a className='link'>Forgot password?</a></p> <p>Dont have an account?  <Link to="/signup">Create an account</Link></p>
            </div>
        </div>
    )
}

export default LoginPage