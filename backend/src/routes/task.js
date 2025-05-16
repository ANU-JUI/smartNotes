const express = require('express');
const router = express.Router();

module.exports = (db) => {
  const tasksCollection = db.collection('tasks');

  // Create a new task
  router.post('/', async (req, res) => {
    try {
      const { userId, ...task } = req.body;
      const docRef = await tasksCollection.add({ userId, ...task });
      res.status(201).json({ id: docRef.id, ...task });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  // Get all tasks for a specific user
  router.get('/', async (req, res) => {
    try {
      const { userId } = req.query;
      const snapshot = await tasksCollection.where('userId', '==', userId).get();
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  // Get a single task by ID
  router.get('/:id', async (req, res) => {
    try {
      const doc = await tasksCollection.doc(req.params.id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update a task by ID
  router.put('/:id', async (req, res) => {
    try {
      const task = req.body;
      const docRef = tasksCollection.doc(req.params.id);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Task not found' });
      }
      await docRef.update(task);
      res.status(200).json({ id: req.params.id, ...task });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete a task by ID
  router.delete('/:id', async (req, res) => {
    try {
      const docRef = tasksCollection.doc(req.params.id);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Task not found' });
      }
      await docRef.delete();
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};