import { db } from '../firebase.js';
import admin from 'firebase-admin';

// Function to get all ads (including current and future ads)
export async function getAllAds(req, res) {
  try {
    // Query all ads from Firestore
    const adsSnapshot = await db.collection('ads').get();

    const ads = adsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ success: true, ads });
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ads.' });
  }
}

// Function to create a new ad
export async function createAd(req, res) {
  const { companyName, email, adImageUrl, adLink, adType, startDate, expiryDate } = req.body;

  if (!companyName || !email || !adImageUrl || !adLink || !startDate || !expiryDate || !adType) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  try {
    const newAd = {
      companyName,
      email,
      adImage: adImageUrl,  // Store the image URL provided by the company
      adLink,
      adType,
      startDate: admin.firestore.Timestamp.fromDate(new Date(startDate)),
      expiryDate: admin.firestore.Timestamp.fromDate(new Date(expiryDate)),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Add the new ad to Firestore
    await db.collection('ads').add(newAd);

    res.status(200).json({ success: true, message: 'Ad created successfully.' });
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).json({ success: false, message: 'Failed to create ad.' });
  }
}

// Function to delete an ad
export async function deleteAd(req, res) {
  const { adId } = req.body;

  if (!adId) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  try {
    // Reference to the specific ad
    const adRef = db.collection('ads').doc(adId);

    // Check if the ad exists before deleting
    const adSnapshot = await adRef.get();

    if (adSnapshot.exists) {
      await adRef.delete();
      res.status(200).json({ success: true, message: 'Ad deleted successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Ad not found.' });
    }
  } catch (error) {
    console.error('Error deleting ad:', error);
    res.status(500).json({ success: false, message: 'Failed to delete ad.' });
  }
}
