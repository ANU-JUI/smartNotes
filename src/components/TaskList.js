import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, MenuItem, Paper, Typography, Button} from '@mui/material';
import TaskCard from './TaskCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { se } from 'date-fns/locale';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [weeks, setWeeks] = useState([]);
  const navigate = useNavigate();

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Get userId from localStorage
        const response = await axios.get('http://localhost:8080/api/tasks', {
          params: { userId }, // Pass userId as a query parameter
        });
        setTasks(response.data);
        setFilteredTasks(response.data); // Initialize filtered tasks
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);
  // Apply filters 
  const applyFilters = () => {
    let filtered = tasks;

    if (selectedMonth) {
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getMonth() === selectedMonth.getMonth() &&
          taskDate.getFullYear() === selectedMonth.getFullYear()
        );
      });
    }

    if (selectedWeek) {
      const weekNumber = parseInt(selectedWeek, 10);
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.dueDate);
        const weekOfMonth = Math.ceil((taskDate.getDate() - 1) / 7);
        return weekOfMonth === weekNumber;
      });
    }

    setFilteredTasks(filtered);
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedMonth(null);
    setSelectedWeek('');
    setFilteredTasks(tasks);
  };

  // Handle month change
  const handleMonthChange = (date) => {
    setSelectedMonth(date);

    if (date) {
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      const totalWeeks = Math.ceil(daysInMonth / 7);
      const dynamicWeeks = Array.from({ length: totalWeeks }, (_, i) => `Week ${i + 1}`);
      setWeeks(dynamicWeeks);
    } else {
      setWeeks([]);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
      setFilteredTasks(filteredTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Handle task completion toggle
  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      const updatedTask = { ...task, completed: !task.completed };
      await axios.put(`http://localhost:8080/api/tasks/${taskId}`, updatedTask);
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
      setFilteredTasks(filteredTasks.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Your Tasks
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Select a Month"
              type="month"
              value={selectedMonth ? `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}` : ''}
              onChange={(e) => {
                const [year, month] = e.target.value.split('-');
                const date = new Date(year, month - 1);
                handleMonthChange(date);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                width: '100%', // Full width for responsiveness
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="Select Week"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              disabled={!weeks.length}
              sx={{
                width: '100%', // Full width for responsiveness
              }}
            >
              {weeks.map((week, index) => (
                <MenuItem key={index} value={index + 1}>
                  {week}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={applyFilters}
              sx={{
                width: '100%', // Full width for responsiveness
              }}
            >
              Apply Filters
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={clearFilters}
              sx={{
                width: '100%', // Full width for responsiveness
              }}
            >
              Clear Filters
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/task/new')}
              sx={{
                width: '100%', // Full width for responsiveness
              }}
            >
              Add New Task
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <TaskCard
                task={task}
                onDelete={() => handleDeleteTask(task.id)}
                onToggleComplete={() => handleToggleComplete(task.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}

export default TaskList;