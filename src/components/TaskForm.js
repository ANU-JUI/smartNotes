import React, { useState, useEffect } from 'react';
import { Container, Paper, TextField, Button, Box, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ChromePicker } from 'react-color'; // Import ChromePicker

function TaskForm() {
  const { id } = useParams(); // Get task ID from URL params
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().slice(0, 16), // Format for datetime-local input
    completed: false,
    color: '#ffffff', // Default color
  });

  // Fetch task details if editing an existing task
  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/tasks/${id}`); // Fetch task by ID
          const fetchedTask = response.data;
          setTask({
            ...fetchedTask,
            dueDate: new Date(fetchedTask.dueDate).toISOString().slice(0, 16), // Format for datetime-local input
          });
        } catch (error) {
          console.error('Error fetching task:', error);
        }
      };
      fetchTask();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId'); // Get userId from localStorage
  
      if (id) {
        // Update existing task
        await axios.put(`http://localhost:8080/api/tasks/${id}`, {
          ...task,
          userId, // Include userId
        });
      } else {
        // Create new task
        await axios.post('http://localhost:8080/api/tasks', {
          ...task,
          userId, // Include userId
        });
      }
      navigate('/tasks'); // Redirect to the task list
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save the task. Please try again.');
    }
  };
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle color change
  const handleColorChange = (color) => {
    setTask((prev) => ({
      ...prev,
      color: color.hex, // Update the color in the task state
    }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {id ? 'Edit Task' : 'Create New Task'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={task.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={task.description}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="Due Date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={task.completed}
                  onChange={handleChange}
                  name="completed"
                />
              }
              label="Completed"
              sx={{ mt: 2 }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Select Task Color:
              </Typography>
              <ChromePicker
                color={task.color}
                onChangeComplete={handleColorChange} // Update color on change
              />
            </Box>
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

export default TaskForm;