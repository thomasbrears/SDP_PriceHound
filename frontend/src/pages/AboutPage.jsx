import React from 'react';
import MainHeadTitle from '../components/MainHeadTitle'; 
import PinkButton from '../components/PinkButton'; 
import '../css/AboutPage.css'; 

function AboutPage() {
  return (
    <div className="about-page">
      <MainHeadTitle 
        title="About Us" 
        subtitle="Learn about PriceHound and how we started"
      />
      <div className="about-content">
        <p>Welcome to our platform! We are dedicated to helping you compare prices from around the world, all from the comfort of your couch. Our mission is to make shopping smarter and easier for everyone.</p>
        <p>PriceHound was created by a bunch of AUT uni students trying to complete our SDP paper. We wanted to create a platform that would help people find the best deals on products they love. </p>
        <p>We hope you find this website useful and continue to share it with your friends and family</p>
        <PinkButton text="Try it out today: Search a product" />
      </div>
    </div>
  );
}

export default AboutPage;
