import React, { useState } from 'react';
import { auth } from '../FirebaseAuth/Firebase.js';
import { useNavigate, Link} from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { sendPasswordResetEmail } from 'firebase/auth';

function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const HandleSubmit = async (e) => {
    e.preventDefault();
      sendPasswordResetEmail(auth, email).then(() => {
        alert("success, check your email for a link!")
        navigate("/login")
      }).catch((error) => {
    alert("error sending email")
  })

}

return (
  <div className='center'>
    <div className='loginDetails'>
      <img src="/images/PriceHound_Logo.png" alt='profilehead' />
      <h1>Reset Password</h1>
      <p>Enter your email, if an account linked to the email exists, a email with a link to reset your password will be sent</p>
      <form onSubmit={HandleSubmit} className='loginForm'>
        <FaUser />
        <input type='email' onChange={(e) => setEmail(e.target.value)} required className="formInput" placeholder='Enter your email'></input>
        <button type='submit' className="formButton">Submit</button>
      </form>
      <p> <Link to="/login">Login?</Link> <Link to="/signup">Create an account?</Link></p>
    </div>
  </div>

);
}

export default ResetPasswordPage;