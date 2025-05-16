const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Firebase initialization
const serviceAccount = require('../smart-note-8cd7c-firebase-adminsdk-fbsvc-49806bd683.json');
initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

// Initialize Express app
const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const notesRoutes = require('./routes/notes');
const tasksRoutes = require('./routes/task');
const usersRoutes = require('./routes/users');

// Use routes
app.use('/api/notes', notesRoutes(db));
app.use('/api/tasks', tasksRoutes(db));
app.use('/api/users', usersRoutes(db));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});