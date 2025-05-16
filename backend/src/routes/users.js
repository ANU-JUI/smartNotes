const express = require('express');
const router = express.Router();

module.exports = (db) => {
  const usersCollection = db.collection('users');

  // Create a new user
  router.post('/', async (req, res) => {
    try {
      const user = req.body;
      const docRef = await usersCollection.add(user);
      res.status(201).json({ id: docRef.id, ...user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  // Get a user by ID
  router.get('/:id', async (req, res) => {
    try {
      const doc = await usersCollection.doc(req.params.id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update a user by ID
  router.put('/:id', async (req, res) => {
    try {
      const user = req.body;
      const docRef = usersCollection.doc(req.params.id);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }
      await docRef.update(user);
      res.status(200).json({ id: req.params.id, ...user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete a user by ID
  router.delete('/:id', async (req, res) => {
    try {
      const docRef = usersCollection.doc(req.params.id);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }
      await docRef.delete();
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Login user
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate email and password
      const snapshot = await usersCollection.where('email', '==', email).where('password', '==', password).get();
      if (snapshot.empty) {
        return res.status(401).json({ error: 'Invalid email or password!' });
      }

      // Return user data
      const user = snapshot.docs[0].data();
      res.status(200).json({ id: snapshot.docs[0].id, username: user.username, email: user.email });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Failed to log in' });
    }
  });

  return router;
};