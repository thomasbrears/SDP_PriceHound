import React from 'react';
import MainHeadTitle from '../components/MainHeadTitle';
import PinkButton from '../components/PinkButton'; 
import '../css/ContactPage.css'; 

function ContactPage() {
  return (
    <div className="contact-page">
      <MainHeadTitle 
        title="Contact us"
        subtitle="Reach out to the PriceHound Team"
      />
      <div className="contact-form-container">
        <p>If you would like to contact the PriceHound Team, please use the contact form below. We aim to reply to all messages within 48 working hours.</p>
        <form className="contact-form">
          <div className="contact-form-group">
            <input type="text" className="contact-input" placeholder="Please enter your first and last name" required />
            <input type="email" className="contact-input" placeholder="Please enter your email address" required />
          </div>
          <div className="contact-form-group">
            <select className="contact-select" required>
              <option value="">Please select a reason for contact</option>
              <option value="question">General Question</option>
              <option value="support">Support</option>
              <option value="feedback">Feedback</option>
            </select>
            <input type="text" className="contact-input" placeholder="Product URL (if applicable)" />
          </div>
          <textarea className="contact-textarea" placeholder="Please Type your message here" required></textarea>
          <PinkButton text="Submit" style={{ width: '250px' }} />
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
