import { updateProfile, getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
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
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const actionCodeSettings = {

        url: 'http://localhost:3000/login',

        handleCodeInApp: true
    };
    
    //func to handle signups, first checks if the password is equal 
    const HandleSubmit = async (e) => {
        e.preventDefault();
        if (password.localeCompare(confirmPassword) !== 0) {
            setMessageInfo({ message: 'Passwords do not match', type: 'error' });
            return;
        }
        try {
            // First, create the account with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            localStorage.setItem('token', user.accessToken);
            localStorage.setItem('user', JSON.stringify(user));
    
            // Upload default profile picture to Firebase Storage
            const storageRef = ref(storage, `icons/${user.uid}`);
            const response = await fetch('images/profile.png');
            const blob = await response.blob();
            await uploadBytes(storageRef, blob);
    
            // Update the user's display name in Firebase
            await updateProfile(user, { displayName: name });
            await user.reload();
            localStorage.setItem('user', JSON.stringify({ ...user, name: name }));
    
            // Send email verification
            await sendEmailVerification(user);
            setMessageInfo({ message: 'Account Created - Please check your email to verify your account', type: 'success' });
    
            // Redirect to Check/verify Email page
            navigate('/verify-email');

        } catch (error) {
            setMessageInfo({ message: 'Oops, an error occurred during signup', type: 'error' });
        }
    
        try {
            // Store user data in Firestore for wishlist, etc.
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const formData = {
                uid: storedUser.uid,
                name: storedUser.name != null ? storedUser.name : "No name",
                email: storedUser.email,
            };
    
            // Send the form data to the backend API
            await axios.post(userUrl, formData);
        } catch (error) {
            setMessageInfo({ message: 'Error: Unable to submit your information', type: 'error' });
        }
    };
    
    const handleGoogle = async (e) => {
        e.preventDefault();
        try {
            //simular to the regular sign up but for when users sign up with google, does all the same relevant steps just a bit simpler due to google sign in
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            localStorage.setItem('token', user.accessToken)
            localStorage.setItem('user', JSON.stringify(user))
            //same thing but uses the google profile picture this time
            const storageRef = ref(storage, `icons/${user.uid}`);
            const response = await fetch(user.photoURL);
            const blob = await response.blob();
            await uploadBytes(storageRef, blob);
            try {
                //and registering the user in our database for their wishlist
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const formData = {
                    uid: storedUser.uid,
                    name: storedUser.name != null ? storedUser.name : "No name",
                    email: storedUser.email

                };
                const dbresponse = await axios.post('http://localhost:8000/api/userinfo', formData);
                navigate('/manage-account');
            }
            catch (err) { }

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
                    <input className="formInput" type="text" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)} />
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

                {messageInfo.message && ( <Message key={Date.now()} message={messageInfo.message} type={messageInfo.type} />)}                

            </div>
        </div>
    );
};

export default SignUpPage;