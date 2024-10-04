import React, { useState } from 'react';
import { useContext } from 'react';
import '../css/AuthPages.css';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '../FirebaseAuth/Firebase.js';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '../FirebaseAuth/Firebase';
import { getDownloadURL, ref } from 'firebase/storage'
import { ThemeContext } from '../ThemeContext';
import { toast } from 'react-toastify'; // Toastify success/error/info messages

function LoginPage() {
    //variables that are used throughout this page
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    //fetches an existing icon from firebase storage
    const fetchIcon = async (uid) => {
        try {
            const storageRef = ref(storage, `icons/${uid}`);
            const url = await getDownloadURL(storageRef);
            localStorage.setItem('icon', url);
        }
        catch (error) {
            toast.error('Opps! An error occurred while fetching your icon.');
            console.error("Error fetching icon from firebase:", error);  // Log the error
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
            toast.success('Signed in successfully!', { position: 'top-right', autoClose: 3000 });
        } catch (error) {
            console.error("Error during sign-in:", error);  // Log the error for debugging
            // Handle specific Firebase authentication errors
            switch (error.code) {
                case 'auth/user-not-found':
                    toast.error('No user found with this email.');
                    break;
                case 'auth/invalid-password':
                    toast.error('Incorrect password. Please try again.');
                    break;
                case 'auth/invalid-email':
                    toast.error('Invalid email format. Please enter a valid email address.');
                    break;
                case 'auth/invalid-credential':
                    toast.error('Invalid credentials. Please try again.');
                    break;
                default:
                    toast.error('Login failed. Please try again.');
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
            toast.success('Signed in with Google successfully!', { position: 'top-right', autoClose: 3000 });
        } catch (error) {
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    toast.error('Google sign-in was canceled. Please try again.');
                    break;
                case 'auth/network-request-failed':
                    toast.error('Network error. Please check your connection and try again.');
                    break;
                default:
                    toast.error('Error with Google sign-in. Please try again.');
                    break;
            }
        }
    }

    // function for passwordless sign in using email link
    const handlePasswordlessSignIn = async (e) => {
        e.preventDefault();
        const actionCodeSettings = {
            url: 'http://localhost:3000/email-signin',
            handleCodeInApp: true,
        };
    
        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            // Store the email locally to complete sign-in later
            window.localStorage.setItem('emailForSignIn', email);
            toast.success('Sign-in link sent! Check your email.', { position: 'top-center', autoClose: 7000 });
        } catch (error) {
            toast.error(`Error sending sign-in link: ${error.message}`);
        }
    };

    const { theme } = useContext(ThemeContext);
    const logoSrc = theme === 'light' ? 'images/PH-logo-blacktext.png' : 'images/PH-logo-whitetext.png';
    
    return (
        <div className='center'>
            <div className='loginDetails'>
                <img src={logoSrc} alt='PriceHound logo' />
                <h1>Sign in</h1>
                <form onSubmit={HandleSubmit} className="loginForm">
                    <div className="separator">
                        <span className="separator-text">Sign in with email</span>
                    </div>
                    <input className="formInput" type="email" onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
                    <input className="formInput" type="password" onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
                    
                    <p className="forgot-password"> <Link to="/reset-password" className="link">Forgot password?</Link></p>

                    <button type="submit" className="login-btn">Sign in</button>
                    <br />
                    {/* Button for passwordless sign-in */}
                    <button type="button" className="login-btn" onClick={handlePasswordlessSignIn}>Email me a Sign-in Link</button>

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

            </div>
        </div>
    )
}

export default LoginPage