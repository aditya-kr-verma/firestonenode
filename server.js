const express = require('express');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

const app = express();
app.use(cors()); // Allows your frontend to connect
app.use(express.json()); // Allows reading JSON data sent from frontend

// Your config is pulled safely from Render Environment Variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase on the server
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Route to save data
app.post('/save', async (req, res) => {
  try {
    const docRef = await addDoc(collection(db, 'users_data'), {
      ...req.body,
      createdAt: serverTimestamp()
    });
    res.status(200).json({ success: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to fetch data
app.get('/fetch', async (req, res) => {
  try {
    const { getDocs } = require('firebase/firestore');
    const snapshot = await getDocs(collection(db, 'users_data'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
