import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../FirebaseAuth/Firebase.js';
import "../css/AuthPages.css"
import Message from '../components/Message';
import { FaUser } from "react-icons/fa";
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../FirebaseAuth/Firebase';

const SignUpPage = () => {
    const userUrl = process.env.NODE_ENV === 'production'
        ? 'https://pricehound.tech/api/userinfo'
        : 'http://localhost:8000/api/userinfo';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [messageInfo, setMessageInfo] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    const actionCodeSettings = {

        url: 'http://localhost:3000/login',

        handleCodeInApp: true
    };

    const HandleSubmit = async (e) => {
        e.preventDefault();
        if (password.localeCompare(confirmPassword) != 0) {
            setMessageInfo({ message: 'Passwords do not match', type: 'error' });
            return;
        }
        else {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log(userCredential)
                const user = userCredential.user;
                localStorage.setItem('token', user.accessToken)
                localStorage.setItem('user', JSON.stringify(user))
                const storageRef = ref(storage, `icons/${user.uid}`);
                const response = await fetch('images/profile.png');
                const blob = await response.blob();
                await uploadBytes(storageRef, blob);
                try {
                    await sendEmailVerification(user);
                    setMessageInfo({ message: 'Please check your inbox to verify your email', type: 'success' });

                }
                catch (error) {
                    setMessageInfo({ message: 'Error during sign-up', type: 'error' });
                    return;
                }

                //database query to register user id would go here
                alert("user id is " + user.uid)

            } catch (error) {
                setMessageInfo({ message: 'An error occured', type: 'error' });
                return;
            }
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const formData = {
                    uid: storedUser.uid,
                    name: storedUser.name != null ? storedUser.name : "No name",
                    email: storedUser.email

                };
                // Send the form data to the backend API

                const response = await axios.post('http://localhost:8000/api/userinfo', formData);  // Using environment variable
                //navigate to home
                navigate('/');
                // If the response is successful, show success message
                if (response.data.success) {
                    setMessageInfo({ message: 'Your message has been successfully sent!', type: 'success' });
                } else {
                    setMessageInfo({ message: 'Failed to send your message. Please try again.', type: 'error' });
                }
            } catch (error) {
                // If there is an error, show an error message
                setMessageInfo({ message: 'Error: Unable to submit your message.', type: 'error' });
            }
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
            setMessageInfo({ message: 'Error with Google sign-up', type: 'error' });
        }
    }
    return (
        <div className="center">
            <div className="signUpDetails">
                <img src="/images/PriceHound_Logo.png" alt="profilehead" />
                <h1>Sign Up</h1>
                <form onSubmit={HandleSubmit} className="signUpForm">
                    <div className="separator">
                        <span className="separator-text">Sign up with email</span>
                    </div>
                    <input className="formInput" type="email" placeholder="Your Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="formInput" type="password" placeholder="Your Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input className="formInput" type="password" placeholder="Confirm password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button className="login-btn">Sign up</button>

                    <div className="separator">
                        <span className="separator-text">Or sign up with Google</span>
                    </div>
                    <button className="login-with-google-btn" type="button" onClick={handleGoogle}>
                        Sign up with Google
                    </button>
                </form>

                <p className="signup-text">
                    Already have an account? <Link to="/login" className="link">Sign in</Link>
                </p>

                {messageInfo.message && <Message message={messageInfo.message} type={messageInfo.type} />}

            </div>
        </div>
    );
};

export default SignUpPage;