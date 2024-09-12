import express from 'express';
import admin from 'firebase-admin';
import mailjet from 'node-mailjet';

const router = express.Router();
const db = admin.firestore();

// Initialize Mailjet with API Key and Secret Key
const mailjetClient = mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

// Handle contact form submission
router.post('/submit-contact-form', async (req, res) => {
  const { name, email, reason, productUrl, subject, message } = req.body;

  try {
    // Save contact form data to Firestore
    await db.collection('website_contact_form').add({
      name,
      email,
      subject,
      reason,
      productUrl,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const logoUrl = 'https://i.ibb.co/9pCMS5w/Price-Hound-Logo.png';

    // Send email to the PriceHound team
    const teamRequest = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": "system@pricehound.tech",
              "Name": "PriceHound Team"
            },
            "To": [
              {
                "Email": "support@pricehound.tech",
                "Name": "PriceHound Team"
              }
            ],
            "ReplyTo": {
              "Email": email,
              "Name": name
            },
            "Subject": `New Contact Form Submission: ${subject}`,
            "TextPart": `You have received a new contact form submission from ${name}.\n\nSubject: ${subject}\nReason: ${reason}\nProduct URL: ${productUrl}\nMessage: ${message}\nEmail: ${email}`,
            "HTMLPart": `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <img src="${logoUrl}" alt="PriceHound Logo" style="width: 150px; height: auto; margin-bottom: 20px;" />
                <h3 style="color: #333;">New Contact Form Submission from ${name}</h3>
                <p><b>Subject:</b> ${subject}</p>
                <p><b>Reason:</b> ${reason}</p>
                <p><b>Product URL:</b> ${productUrl}</p>
                <p><b>Message:</b> ${message}</p>
                <p><b>Email:</b> ${email}</p>
              </div>`          
            }
        ]
      });

    // Send acknowledgment email to the submitter
    const userRequest = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": "system@pricehound.tech",
              "Name": "PriceHound Team"
            },
            "To": [
              {
                "Email": email,
                "Name": name
              }
            ],
            "Subject": `Thank you for contacting PriceHound: ${subject}`,
            "TextPart": `Kia ora ${name},\n\nThank you for reaching out to the PriceHound team regarding "${subject}". We have received your message and will get back to you within 48 working hours.\n\nHere’s a copy of your submission:\nReason: ${reason}\nProduct URL: ${productUrl}\nMessage: ${message}\n\nBest regards,\nPriceHound Team`,
            "HTMLPart": `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <img src="${logoUrl}" alt="PriceHound Logo" style="width: 150px; height: auto; margin-bottom: 20px;" />
                <h3 style="color: #333;">Thank you for contacting PriceHound, ${name}</h3>
                <p>We have received your message regarding <b>${subject}</b> and will get back to you within 48 working hours.</p>
                <p><b>Reason:</b> ${reason}</p>
                <p><b>Product URL:</b> ${productUrl}</p>
                <p><b>Message:</b> ${message}</p>
                <p>Best regards,<br>PriceHound Team</p>
              </div>`        
            }
        ]
      });

    // Send both emails concurrently using Promise.all
    Promise.all([teamRequest, userRequest])
      .then((results) => {
        console.log(results[0].body);  // Log the result from the first request
        console.log(results[1].body);  // Log the result from the second request
        // Send success response
        res.status(200).send({ success: true, message: 'Your message has been successfully sent!' });
      })
      .catch((err) => {
        console.error('Error sending email:', err.statusCode);
        res.status(500).send({ success: false, message: 'Failed to send email', error: err });
      });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).send({ success: false, message: 'Failed to submit the contact form', error });
  }
});

export default router;