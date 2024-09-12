import React, { useState } from 'react';
import '../css/AuthPages.css';
import Message from '../components/Message';
import { FaUser } from "react-icons/fa";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../FirebaseAuth/Firebase.js';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '../FirebaseAuth/Firebase';
import { getDownloadURL, ref } from 'firebase/storage'

function LoginPage() {
    //variables that are used throughout this page
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [messageInfo, setMessageInfo] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    //fetches an existing icon from firebase storage
    const fetchIcon = async (uid) => {
        try {
            const storageRef = ref(storage, `icons/${uid}`);
            const url = await getDownloadURL(storageRef);
            localStorage.setItem('icon', url);
        }
        catch (error) {
            setMessageInfo({ message: 'Error', type: 'error' });
        }
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    //function for logging in, sends request to firebase auth with relevant info and then calls the fetch icon to store in local storage based on the uid before redirecting to home
    const HandleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            localStorage.setItem('token', user.accessToken)
            localStorage.setItem('user', JSON.stringify(user))
            await fetchIcon(user.uid);
            navigate("/")
        } catch (error) {
            console.error("Error during sign-in:", error);  // Log the error for debugging
            // Handle specific Firebase authentication errors
            switch (error.code) {
                case 'auth/user-not-found':
                    setMessageInfo({ message: 'No user found with this email.', type: 'error' });
                    break;
                case 'auth/invalid-password':
                    setMessageInfo({ message: 'Incorrect password. Please try again.', type: 'error' });
                    break;
                case 'auth/invalid-email':
                    setMessageInfo({ message: 'Invalid email format. Please enter a valid email address.', type: 'error' });
                    break;
                case 'auth/invalid-credential':
                    setMessageInfo({ message: 'Invalid credentials. Please try again.', type: 'error' });
                    break;
                default:
                    setMessageInfo({ message: 'Login failed. Please try again.', type: 'error' });
                    break;
            }
        }
    }
    //simular thing to normal login just through google popup, fetches the user icon from firebase storage and sets it to local storage
    const handleGoogle = async (e) => {
        e.preventDefault();
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            localStorage.setItem('token', user.accessToken)
            localStorage.setItem('user', JSON.stringify(user))
            await fetchIcon(user.uid);
            navigate("/")
            //message based on the success
        } catch (error) {
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    setMessageInfo({ message: 'Google sign-in was canceled. Please try again.', type: 'error' });
                    break;
                case 'auth/network-request-failed':
                    setMessageInfo({ message: 'Network error. Please check your connection and try again.', type: 'error' });
                    break;
                default:
                    setMessageInfo({ message: 'Error with Google sign-in. Please try again.', type: 'error' });
                    break;
            }
        }
    }
    return (
        <div className='center'>
            <div className='loginDetails'>
                <img src="/images/PriceHound_Logo.png" alt='profilehead' />
                <h1>Sign in</h1>
                <form onSubmit={HandleSubmit} className="loginForm">
                    <div className="separator">
                        <span className="separator-text">Sign in with email</span>
                    </div>
                    <input className="formInput" type="email" onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
                    <input className="formInput" type="password" onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
                    <button type="submit" className="login-btn">Sign in</button>
                    
                    <p className="forgot-password">
                        <Link to="/reset-password" className="link">Forgot password?</Link>
                    </p>

                    <div className="separator">
                        <span className="separator-text">Or sign in with Google</span>
                    </div>

                    <button type="button" className="login-with-google-btn" onClick={handleGoogle}>
                        Sign in with Google
                    </button>
                </form>

                <p className="signup-text">
                    Don't have an account? <Link to="/signup" className="link">Sign up</Link>
                </p>

                {messageInfo.message && ( <Message key={Date.now()} message={messageInfo.message} type={messageInfo.type} />)}                
            </div>
        </div>
    )
}

export default LoginPage