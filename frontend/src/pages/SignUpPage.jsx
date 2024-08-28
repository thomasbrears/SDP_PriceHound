import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../FirebaseAuth/Firebase.js';
import "../css/SignUpPage.css"
import { FaUser } from "react-icons/fa";

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const actionCodeSettings = {

        url: 'http://localhost:3000/login',

        handleCodeInApp: true
    };

    const HandleSubmit = async (e) => {
        e.preventDefault();
        if (password.localeCompare(confirmPassword) != 0) {
            alert('passwords do not match')
            return;
        }
        else {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log(userCredential)
                const user = userCredential.user;
                localStorage.setItem('token', user.accessToken)
                localStorage.setItem('user', JSON.stringify(user))
                try {
                    await sendEmailVerification(user);
                    alert("please check your inbox to verify your email")
                    
                } 
                catch(error) {
                    alert("error sending email")
                    return;
                }

                //database query to register user id would go here
                alert("user id is " + user.uid)
                navigate("/")
            } catch (error) {
                alert("error")
                return;
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

        }
    }
    return (
        <div className='center'>
            <div className='signUpDetails'>
                <img src="/images/PriceHound_Logo.png" alt='profilehead' />
                <h1>Sign Up</h1>
                <form onSubmit={HandleSubmit} className='signUpForm'>
                    <FaUser />
                    <input className="formInput" type='email' placeholder='Your Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="formInput" type='password' placeholder='Your Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input className="formInput" type='password' placeholder='Confirm password' required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button className="formButton" type="submit"> Sign up </button>
                    <button className="gButton" type="button" onClick={handleGoogle}>Signup with google!</button>
                </form>
                <p>Need to Login? <Link to="/login">Login</Link></p>

            </div>
        </div>
    )
}


export default SignUpPage
