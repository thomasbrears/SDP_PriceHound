import React, { useState, useEffect } from 'react';
import MainHeadTitle from '../components/MainHeadTitle';
import PinkButton from '../components/PinkButton'; 
import { toast } from 'react-toastify'; // Toastify success/error/info messages
import '../pages/css/ContactPage.css';
import axios from 'axios'; 

function ContactPage() {
  // Manage form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    productUrl: '',
    subject: '',
    message: '',
  });

  // Dynamically determine the API URL based on environment
  const contactApiUrl = process.env.NODE_ENV === 'production'
    ? 'https://pricehound.tech/api/contact'
    : 'http://localhost:8000/api/contact';

  // Populate form fields from localStorage if user is logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      // Pre-fill with users name and email from localStorage if available once on page load
      setFormData((prevData) => ({
        ...prevData,
        name: storedUser.displayName || '',
        email: storedUser.email || '',
      }));
    }
  }, []);

  // Handle input changes and update state
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
      const response = await axios.post('https://pricehound.tech/api/contact/submit-contact-form', formData);

      // If the response is successful, show success message
      if (response.data.success) {
        toast.success('Your message has been successfully sent! We will reply soon.');
      } else {
        // If the response is error/fail, show error message
        toast.error('Sorry, we failed to send your message. Please try again later or email support@pricehound.tech');
      }
    } catch (error) {
      // If there is an error, show error message
      toast.error('Sorry, we failed to send your message. Please try again later or email support@pricehound.tech');
      console.error('Error sending contact form:', error);}
  };

  return (
    <div className="contact-page">
      <MainHeadTitle 
        title="Contact us"
        subtitle="Reach out to the PriceHound Team"
      />
      <div className="contact-form-container">
        <p>If you would like to contact the PriceHound Team, please use the contact form below. We aim to reply to all messages within 48 working hours.</p>
        
        {/* Contact form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Name and Email fields */}
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
          {/* Reason and Product URL fields */}
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
              <option value="account-issues">Account Issues</option>
              <option value="bug">Report a Bug</option>
              <option value="media">Media</option>
              <option value="other">Other</option>
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
          {/* Subject fields */}
          <div className="contact-form-group">
            <input 
              type="text" 
              className="contact-input" 
              name="subject"
              value={formData.subject} // New subject field
              onChange={handleChange}
              placeholder="Subject" 
              required 
            />
          </div>
          {/* Message field */}
          <textarea 
            className="contact-textarea" 
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Please Type your message here" 
            required
          ></textarea>

          {/* Submit button */}
          <PinkButton text="Submit" style={{ width: '250px' }} />
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
