import React, { useState, useEffect } from 'react';
import { Container, Paper, TextField, Button, Box, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ChromePicker } from 'react-color'; // Import ChromePicker


function NoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({
    title: '',
    content: '',
    pinned: false,
    color: '#ffffff', // Default color
  });

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/notes/${id}`); // Fetch task by ID
          const fetchedTask = response.data;
          setNote({
            ...fetchedTask, // Format for datetime-local input
          });
        } catch (error) {
          console.error('Error fetching task:', error);
        }
      };
      fetchTask();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId'); // Get userId from localStorage
  
      if (id) {
        // Update existing note
        await axios.put(`http://localhost:8080/api/notes/${id}`, {
          ...note,
          userId, // Include userId
        });
      } else {
        // Create new note
        const response = await axios.post('http://localhost:8080/api/notes', {
          ...note,
          userId, // Include userId
        });
        setNote({ ...note, createdAt: response.data.createdAt }); // Update createdAt in state
      }
      navigate('/home'); // Redirect to the home page
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save the note. Please try again.');
    }
  };
  // Handle input changes
  const handleColorChange = (color) => {
    setNote((prev) => ({
      ...prev,
      color: color, // Update the color in the task state
    }));
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNote((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, // Handle checkbox for 'pinned' and other inputs for text
    }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {id ? 'Edit Note' : 'Create New Note'}
          </Typography>
          <form onSubmit={handleSubmit}>
          <TextField
  fullWidth
  label="Title"
  name="title"
  value={note.title}
  onChange={handleChange}
  margin="normal"
/>
<TextField
  fullWidth
  multiline
  rows={4}
  label="Content"
  name="content"
  value={note.content}
  onChange={handleChange}
  margin="normal"
/>
<FormControlLabel
  control={
    <Checkbox
      name="pinned"
      checked={note.pinned}
      onChange={handleChange}
    />
  }
  label="Pin this note"
/>
            <ChromePicker
              color={note.color}
              onChangeComplete={(color) => handleColorChange(color.hex)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" type="submit">
                {id ? 'Update' : 'Create'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default NoteForm;