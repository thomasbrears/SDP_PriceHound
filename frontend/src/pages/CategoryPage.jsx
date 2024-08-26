import React from 'react';
import MainHeadTitle from '../components/MainHeadTitle'; 
import PinkButton from '../components/PinkButton'; 
import Footer from '../components/Footer';
import '../css/AboutPage.css'; 

function CategoryPage() {
  return (
    <div className="about-page">
      <MainHeadTitle 
        title="Catergories" 
        subtitle="Category placeholder page"
      />
      
      {/* Footer Section */}
      <Footer/>
    </div>
  );
}

export default CategoryPage;
