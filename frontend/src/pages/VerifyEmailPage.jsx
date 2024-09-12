import React, { useEffect, useState } from 'react';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import "../css/AuthPages.css";

const VerifyEmailPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [messageInfo, setMessageInfo] = useState({ message: '', type: '' });
  const [resendCooldown, setResendCooldown] = useState(30); // 30 seconds countdown
  const [canResend, setCanResend] = useState(false); // They can't resend immediately
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email); // Set the user's email to display
    }

    // Polling to check if the user's email is verified
    const intervalId = setInterval(() => {
      if (user) {
        user.reload(); // Reload user data to check if email is verified
        if (user.emailVerified) {
          clearInterval(intervalId);
          setMessageInfo({ message: 'Email verified! Redirecting to your account...', type: 'success' });
          setTimeout(() => {
            navigate('/manage-account'); // Redirect to Manage Account page after verification
          }, 3000); // Wait for 3 seconds before redirecting
        }
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [auth, navigate]);

  // Countdown logic for resend email button
  useEffect(() => {
    let timer;
    if (resendCooldown > 0 && !canResend) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else if (resendCooldown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendCooldown, canResend]);

  // Handle resend email
  const handleResendEmail = async () => {
    try {
      const user = auth.currentUser;
      await sendEmailVerification(user);
      setMessageInfo({ message: 'Verification email resent! Please check your inbox.', type: 'success' });
      setCanResend(false); // Disable the resend button
      setResendCooldown(30); // Reset countdown
    } catch (error) {
      setMessageInfo({ message: 'Failed to resend verification email. Please try again.', type: 'error' });
    }
  };

  // Handle going back to the login or signup page
  const handleGoBack = () => {
    navigate('/signup');
  };

  return (
    <div className="center">
      <div className="verifyEmailDetails">
        <button className="back-button" onClick={handleGoBack}><FaArrowLeft className="back-arrow" /> Back </button>

        <img src="/images/PriceHound_Logo.png" alt="PriceHound Logo" />
        <h1>Verify Your Email</h1>
        <p>
          We have sent a verification email to <b>{userEmail}</b>. Please click the verification link in the email to verify your account.
        </p>
        <p>Once verified, you will be automatically redirected to your account.</p>

        {/* Resend Button with Countdown */}
        <button 
          className="login-btn" 
          onClick={handleResendEmail} 
          disabled={!canResend}>
          {canResend ? 'Resend Email' : `Resend in ${resendCooldown}s`}
        </button>

        {messageInfo.message && (
          <p className={`message ${messageInfo.type}`}>
            {messageInfo.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
