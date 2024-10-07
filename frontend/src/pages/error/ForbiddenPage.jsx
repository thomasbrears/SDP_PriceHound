import React from 'react';
import MainHeadTitle from '../../components/MainHeadTitle'; 
import PinkButton from '../../components/PinkButton'; 
import '../../pages/css/ErrorPage.css'; 

function ForbiddenPage() {
  return (
    <div className="error-page">
      <MainHeadTitle 
        title="Opps! You dont have access to this page" 
        subtitle="Error 403: Forbidden | Access Denied"
      />
      <div className="error-content">
        <p><b>Oops! 🐾</b>
        <br />Our hound tried to get you in, but it seems like you don’t have permission to access this page.
        <br />If you think you should have access, please contact us</p>
      </div>

      <div className="error-content">
        <p><b>Here is what you can do:</b></p>
        <a href="/" className="pink-button">Head back to our main page.</a>
        <br />
        <a href="/search" className="pink-button">Search for the latest prices we've sniffed out for your fav products.</a>
        <br />
        <a href="/contact-us" className="pink-button">Contact us an let us know if something's off, and we'll get our hound on it!</a>        
      </div>
    </div>
  );
}

export default ForbiddenPage;
