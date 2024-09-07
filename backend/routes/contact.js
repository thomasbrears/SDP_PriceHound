import express from 'express';
import admin from 'firebase-admin';
import mailjet from 'node-mailjet';

const router = express.Router();
const db = admin.firestore();

// Initialize Mailjet with API Key and Secret Key
const mailjetClient = mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

// Handle contact form submission
router.post('/submit-contact-form', async (req, res) => {
  const { name, email, reason, productUrl, message } = req.body;

  try {
    // Save contact form data to Firestore
    await db.collection('website_contact_form').add({
      name,
      email,
      reason,
      productUrl,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Send email using Mailjet
    const request = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": "contact@pricehound.tech",
              "Name": "PriceHound Team"
            },
            "To": [
              {
                "Email": "contact@pricehound.tech",
                "Name": "PriceHound Team"
              }
            ],
            "Subject": `New Contact Form Submission from ${name}`,
            "TextPart": `You have received a new contact form submission from ${name}.\n\nReason: ${reason}\nProduct URL: ${productUrl}\nMessage: ${message}\nEmail: ${email}`,
            "HTMLPart": `<h3>New Contact Form Submission from ${name}</h3><p><b>Reason:</b> ${reason}</p><p><b>Product URL:</b> ${productUrl}</p><p><b>Message:</b> ${message}</p><p><b>Email:</b> ${email}</p>`
          }
        ]
      });

    request
      .then((result) => {
        console.log(result.body);
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
