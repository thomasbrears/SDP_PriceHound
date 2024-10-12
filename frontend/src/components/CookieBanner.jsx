import React, { useEffect, useState } from 'react'
import { getAnalytics, logEvent } from "firebase/analytics";
import app from '../FirebaseAuth/Firebase';
import "../css/CookieBanner.css"
function CookieBanner() {
    const [visible, setVisible] = useState(true);

    // Check if the user has already accepted cookies
    useEffect(() => {
        const cookie = localStorage.getItem('cookies');
        if (cookie !== null) {
            if (cookie === 'true') {
                setVisible(false);
                const analytics = getAnalytics(app);
                logEvent(analytics, 'Returning user');
            } else if (cookie === 'false') {
                setVisible(false);
            }
        }
    }, [])

    // Function to log when the user accepts cookies
    const handleClick = () => {
        localStorage.setItem('cookies', true);
        try {
            const analytics = getAnalytics(app);
            logEvent(analytics, 'Allows cookies');
            console.log('Event logged successfully');
        } catch (error) {
            console.error('Error logging event:', error);
        }
        hide();
    }

    // Function to hide the cookie banner
    const hide = () => {
        setVisible(!visible);
        localStorage.setItem('cookies', false);
    }

    return (
        <>
            {visible ? (
                <div className='cookies-div'>
                    <div className='buttons'>
                        <p>We use cookies and other technologies to personalise and improve your experience on our website. By continuing to use this site, you agree to our use of cookies unless you allow necessary cookies only. 
                        <br />To find out more, please see our privacy policy.
                        </p>
                        <button style={{ fontWeight: 'bold' }} onClick={handleClick}>Allow cookies</button>
                        <button style={{ fontWeight: 'bold' }} onClick={hide}>Necessary cookies only</button>
                    </div>
                </div>
            ) : <></>}
        </>
    );
}


export default CookieBanner
