const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Initialize Firebase Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendNotification(deviceTokens, payload) {
    try {
      const response = await admin.messaging().sendToDevice(deviceTokens, {
        data: payload,
      });
  
      console.log('FCM Response:', response);
    } catch (error) {
      console.error('Error sending FCM message:', error);
    }
  }
  
  // Usage example
  const jobApplicationPayload = {
    jobTitle: 'Software Engineer',
    applicantName: 'John Doe',
    // Add more payload data as needed
  };
  
  const userDeviceTokens = ['deviceToken1', 'deviceToken2'];
  sendNotification(userDeviceTokens, jobApplicationPayload);
// Enable CORS
app.use(cors());

// Middleware to authenticate Firebase token
const authenticateFirebaseToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const idToken = authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Firebase Firestore instance
const db = admin.firestore();

// Endpoint to view the job link for a specific job listing
app.get('/job/:jobId', authenticateFirebaseToken, async (req, res) => {
  const { jobId } = req.params;

  try {
    const jobDoc = await db.collection('jobListings').doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const jobData = jobDoc.data();
    return res.json({ jobTitle: jobData.jobTitle, jobLink: generateJobLink(jobId) });
  } catch (error) {
    console.error('Error fetching job details:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to view responses for a specific job listing
app.get('/job/:jobId/responses', authenticateFirebaseToken, async (req, res) => {
  const { jobId } = req.params;

  try {
    const responsesSnapshot = await db
      .collection('jobApplications')
      .where('jobId', '==', jobId)
      .get();

    const responses = responsesSnapshot.docs.map((doc) => doc.data());
    return res.json({ responses });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to generate a unique job link
const generateJobLink = (jobId) => {
  // Implement your logic to generate a unique link
  return `https://your-app.com/apply/${jobId}`;
};

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

