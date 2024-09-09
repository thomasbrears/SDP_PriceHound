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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [messageInfo, setMessageInfo] = useState({ message: '', type: '' });

    const navigate = useNavigate();

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
            setMessageInfo({ message: 'Invalid account', type: 'error' });
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
            await fetchIcon(user.uid);
            navigate("/")
        } catch (error) {
            setMessageInfo({ message: 'Error with Google sign-in', type: 'error' });
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

                {messageInfo.message && <Message message={messageInfo.message} type={messageInfo.type} />}
                
            </div>
        </div>
    )
}

export default LoginPage