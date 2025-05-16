const express = require('express');
const router = express.Router();

module.exports = (db) => {
  const notesCollection = db.collection('notes');

  // Create a new note
  router.post('/', async (req, res) => {
    try {
      const { userId, title, content, pinned, color } = req.body;
  
      // Validate required fields
      if (!userId || !title || !content) {
        return res.status(400).json({ error: 'Missing required fields: userId, title, or content' });
      }
  
      const createdAt = new Date().toISOString(); // Add createdAt field
      const docRef = await notesCollection.add({ userId, title, content, pinned, color, createdAt });
      res.status(201).json({ id: docRef.id, userId, title, content, pinned, color, createdAt });
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Failed to create note' });
    }
  });

  // Get all notes for a specific user
  router.get('/', async (req, res) => {
    try {
      const { userId } = req.query;
      const snapshot = await notesCollection.where('userId', '==', userId).get();
      const notes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  });

  // Get a single note by ID
  router.get('/:id', async (req, res) => {
    try {
      const doc = await notesCollection.doc(req.params.id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update a note by ID
  router.put('/:id', async (req, res) => {
    try {
      const note = req.body;
      const docRef = notesCollection.doc(req.params.id);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Note not found' });
      }
      await docRef.update(note);
      res.status(200).json({ id: req.params.id, ...note });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete a note by ID
  router.delete('/:id', async (req, res) => {
    try {
      const docRef = notesCollection.doc(req.params.id);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Note not found' });
      }
      await docRef.delete();
      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};