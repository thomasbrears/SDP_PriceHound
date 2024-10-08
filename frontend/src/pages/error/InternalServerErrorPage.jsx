import React from 'react';
import MainHeadTitle from '../../components/MainHeadTitle'; 
import PinkButton from '../../components/PinkButton'; 
import '../../pages/css/ErrorPage.css'; 

function InternalServerErrorPage() {
  return (
    <div className="error-page">
      <MainHeadTitle 
        title="Uh oh! Something went wrong on our end" 
        subtitle="Error 500: Internal Server Error"
      />

      <div className="error-content">
        <p><b>Oops! 🐾</b>
        <br />It looks like our server hound got distracted by a shiny object.
        <br />We're working on getting things back in order!</p>
      </div>

      <div className="error-content">
        <p><b>What happened?</b>
        <br />We experienced an interal server error processing your request. Please report this issue to us so was an investigate.</p>
      </div>

      <div className="error-content">
        <p><b>Here is what you can do:</b></p>
        <a href="/" className="pink-button">Head back to our main page.</a>
        <br />
        <a href="/search" className="pink-button">Search for the latest prices we've sniffed out for your fav products.</a>
        <br />
        <a href="/contact-us" className="pink-button">Please REPORT this issue to us, so we get our hound on it!</a>        
      </div>
    </div>
  );
}

export default InternalServerErrorPage;