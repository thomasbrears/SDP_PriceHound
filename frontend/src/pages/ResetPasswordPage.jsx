import React, { useState } from 'react';
import { auth } from '../FirebaseAuth/Firebase.js';
import { useNavigate, Link} from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { sendPasswordResetEmail } from 'firebase/auth';
import '../css/AuthPages.css';
import Message from '../components/Message';

function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [messageInfo, setMessageInfo] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  //function that takes an email and a firebase auth object and sends an email if the user has forgot their password 
  // the link sent will the redirect to the login page
  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
        await sendPasswordResetEmail(auth, email);
        setMessageInfo({ message: 'If an account exists with that email, we have send a password reset email.', type: 'success' });
        // Delay navigation to login page for 3 seconds to display success message
        setTimeout(() => {
          navigate("/login");
      }, 3000); // 3 seconds
    } catch (error) {
        setMessageInfo({ message: 'Error sending reset email', type: 'error' });
    }
};

  return (
    <div className="center">
        <div className="loginDetails">
            <img src="/images/PriceHound_Logo.png" alt="profilehead" />
            <h1>Reset Password</h1>
            <p>Please enter your email and we will email you a link to reset your password</p>
            <form onSubmit={HandleSubmit} className="loginForm">
                <input className="formInput" type="email" onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
                <button className="login-btn">Reset Password</button>
            </form>

            <p className="signup-text">
                Know your password? <Link to="/login" className="link">Sign in</Link>
            </p>
            <p className="signup-text">
                Need an account? <Link to="/signup" className="link">Sign up</Link>
            </p>

            {messageInfo.message && ( <Message key={Date.now()} message={messageInfo.message} type={messageInfo.type} />)}                
        </div>
    </div>
);
}

export default ResetPasswordPage;