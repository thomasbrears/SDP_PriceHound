import React from 'react';
import MainHeadTitle from '../../components/MainHeadTitle'; 
import PinkButton from '../../components/PinkButton'; 
import '../../pages/css/ErrorPage.css'; 

function NotFoundPage() {
  return (
    <div className="error-page">
      <MainHeadTitle 
        title="Opps! We can't find that page" 
        subtitle="Error 404: Page Not Found"
      />
      <div className="error-content">
        <p><b>Oops! 🐾</b>
        <br />It seems our hound got a bit lost while sniffing out the best deals.
        <br />But don't worry, we're on the trail to get you back on track!</p>
      </div>

      <div className="error-content">
        <p><b>What happened?</b>
        <br />You’ve stumbled upon a page that doesn’t exist; It could be an old link, a mistyped URL, or maybe our hound is just too busy chasing bargains.</p>
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

export default NotFoundPage;
