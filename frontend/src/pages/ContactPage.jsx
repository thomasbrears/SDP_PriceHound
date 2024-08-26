import React from 'react';
import MainHeadTitle from '../components/MainHeadTitle'; 
import PinkButton from '../components/PinkButton'; 
import Footer from '../components/Footer';
import '../css/AboutPage.css'; 

function ContactPage() {
  return (
    <div className="about-page">
      <MainHeadTitle 
        title="Contact us" 
        subtitle="contact us placeholder page"
      />
      
      {/* Footer Section */}
      <Footer/>
    </div>
  );
}

export default ContactPage;
