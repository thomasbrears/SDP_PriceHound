import { updateProfile, getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../FirebaseAuth/Firebase.js';
import "../pages/css/AuthPages.css"
import { toast } from 'react-toastify'; // Toastify success/error/info messages
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../FirebaseAuth/Firebase';
import Loading from '../components/Loading.jsx';

const SignUpPage = () => {
    const USER_API_URL = process.env.NODE_ENV === 'production'
        ? 'https://pricehound.tech/api/userinfo'
        : 'http://localhost:8000/api/userinfo';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const navigate = useNavigate();

    const actionCodeSettings = {
        url: 'http://localhost:3000/login',
        handleCodeInApp: true
    };
    
    //func to handle signups, first checks if the password is equal 
    const HandleSubmit = async (e) => {
        e.preventDefault();
        if (password.localeCompare(confirmPassword) !== 0) {
            toast.error('Passwords do not match. Please check and try again.');
            return;
        }

        setLoading(true); // Show loading animation
        setLoadingMessage('Creating your account...');

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
            toast.success('Your account has been created successfully!');
            toast.success('Verification email sent');

            // Redirect to Check/verify Email page
            navigate('/verify-email');

        } catch (error) {
            console.error('Error during sign-up:', error);
            toast.error('Sorry, an error occurred well creating your account. Please try again.');
        } finally {
            setLoading(false); // Stop loading animation
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
            await axios.post(`${USER_API_URL}`, formData);
        } catch (error) {
            toast.error('Sorry, an error occurred well submiting your user data. Please try again.');
        }
    };
    
    const handleGoogle = async (e) => {
        e.preventDefault();

        setLoading(true);
        setLoadingMessage('Signing you up with Google...');

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
                const dbresponse = await axios.post('${USER_API_URL}', formData);
                navigate('/');
            }
            catch (err) { }

        } catch (error) {
            console.error('Error with Google sign-up:', error);
            toast.error('Sorry, an error occurred with Google sign-up');
        } finally {
            setLoading(false); // Stop loading animation
        }
    }
    return (
        <div className="center">
            {loading && <Loading message={loadingMessage} />}
            
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
            </div>
        </div>
    );
};

export default SignUpPage;