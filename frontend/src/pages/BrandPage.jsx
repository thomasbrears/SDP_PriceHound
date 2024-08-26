import React from 'react';
import MainHeadTitle from '../components/MainHeadTitle'; 
import PinkButton from '../components/PinkButton'; 
import Footer from '../components/Footer';
import '../css/AboutPage.css'; 

function BrandPage() {
  return (
    <div className="about-page">
      <MainHeadTitle 
        title="Brands" 
        subtitle="Brands placeholder page"
      />
      
      {/* Footer Section */}
      <Footer/>
    </div>
  );
}

export default BrandPage;
