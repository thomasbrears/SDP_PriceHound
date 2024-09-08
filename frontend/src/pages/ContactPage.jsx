import React, { useState } from 'react';
import MainHeadTitle from '../components/MainHeadTitle';
import PinkButton from '../components/PinkButton'; 
import Message from '../components/Message';
import '../css/ContactPage.css';
import axios from 'axios'; 

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    productUrl: '',
    message: '',
  });

  const [messageInfo, setMessageInfo] = useState({ message: '', type: '' }); // State for managing success/error messages

  // Dynamically determine the API URL based on environment
  const contactApiUrl = process.env.NODE_ENV === 'production'
    ? 'https://pricehound.tech/api/contact'
    : 'http://localhost:8000/api/contact';

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the form data to the backend API
      const response = await axios.post(`${contactApiUrl}/submit-contact-form`, formData);  // Using environment variable
      
      // If the response is successful, show success message
      if (response.data.success) {
        setMessageInfo({ message: 'Your message has been successfully sent!', type: 'success' });
      } else {
        setMessageInfo({ message: 'Failed to send your message. Please try again.', type: 'error' });
      }
    } catch (error) {
      // If there is an error, show an error message
      setMessageInfo({ message: 'Error: Unable to submit your message.', type: 'error' });
    }
  };

  return (
    <div className="contact-page">
      <MainHeadTitle 
        title="Contact us"
        subtitle="Reach out to the PriceHound Team"
      />
      <div className="contact-form-container">
        <p>If you would like to contact the PriceHound Team, please use the contact form below. We aim to reply to all messages within 48 working hours.</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-group">
            <input 
              type="text" 
              className="contact-input" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Please enter your first and last name" 
              required 
            />
            <input 
              type="email" 
              className="contact-input" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Please enter your email address" 
              required 
            />
          </div>
          <div className="contact-form-group">
            <select 
              className="contact-select" 
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            >
              <option value="">Please select a reason for contact</option>
              <option value="question">General Question</option>
              <option value="support">Support</option>
              <option value="feedback">Feedback</option>
            </select>
            <input 
              type="text" 
              className="contact-input" 
              name="productUrl"
              value={formData.productUrl}
              onChange={handleChange}
              placeholder="Product URL (if applicable)" 
            />
          </div>
          <textarea 
            className="contact-textarea" 
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Please Type your message here" 
            required
          ></textarea>
          <PinkButton text="Submit" style={{ width: '250px' }} />
        </form>
        {messageInfo.message && <Message message={messageInfo.message} type={messageInfo.type} />}
      </div>
    </div>
  );
}

export default ContactPage;