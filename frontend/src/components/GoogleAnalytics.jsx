import React, { useState } from 'react'
import { getAnalytics, logEvent } from "firebase/analytics";
import app from '../FirebaseAuth/Firebase';
import "../css/GoogleAnalytics.css"
function GoogleAnalytics() {
    const [visible, setVisible] = useState(true);

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
    const hide = () => {
        setVisible(!visible);
    }

    return (
        <>
            {visible ? (
                <div className='cookies-div'>
                    <div className='buttons'>
                        <p>By clicking "Allow cookies”, you allow us to improve your experience through tracking cookies.</p>
                        <button style={{ fontWeight: 'bold' }} onClick={handleClick}>Allow cookies</button>
                        <button style={{ fontWeight: 'bold' }} onClick={hide}>Necessary cookies only</button>
                    </div>
                </div>
            ) : <></>}
        </>
    );
}


export default GoogleAnalytics
