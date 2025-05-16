import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, MenuItem, Paper, Typography, Button } from '@mui/material';
import NoteCard from './NoteCard';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

function NoteList() {
  const [notes, setNotes] = useState([]); // All notes
  const [filteredNotes, setFilteredNotes] = useState([]); // Filtered notes for display
  const [selectedMonth, setSelectedMonth] = useState(null); // Selected month for filtering
  const [selectedWeek, setSelectedWeek] = useState(''); // Selected week for filtering
  const [weeks, setWeeks] = useState([]); // Dynamic weeks based on the selected month
  const navigate = useNavigate();

  // Fetch notes from the backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Get userId from localStorage
        if (!userId) {
          console.error('User ID not found in localStorage');
          return;
        }

        console.log('Fetching notes for userId:', userId); // Debugging log
        const response = await axios.get('http://localhost:8080/api/notes', {
          params: { userId }, // Pass userId as a query parameter
        });

        console.log('Fetched notes:', response.data); // Debugging log
        setNotes(response.data); // Set all notes
        setFilteredNotes(response.data); // Initialize filtered notes
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  // Navigate to the "Add Note" page
  const handleAddNote = () => {
    navigate('/note/new');
  };

  // Apply filters based on selected month and week
  const applyFilters = () => {
    let filtered = notes;

    if (selectedMonth) {
      filtered = filtered.filter((note) => {
        const noteDate = new Date(note.createdAt);
        return (
          noteDate.getMonth() === selectedMonth.getMonth() &&
          noteDate.getFullYear() === selectedMonth.getFullYear()
        );
      });
    }

    if (selectedWeek) {
      const weekNumber = parseInt(selectedWeek, 10);
      filtered = filtered.filter((note) => {
        const noteDate = new Date(note.createdAt);
        const weekOfMonth = Math.ceil((noteDate.getDate() - 1) / 7); // Calculate week of the month
        return weekOfMonth === weekNumber;
      });
    }

    setFilteredNotes(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedMonth(null);
    setSelectedWeek('');
    setFilteredNotes(notes);
  };

  // Handle month selection and dynamically generate weeks
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

  // Handle pinning a note
  const handlePinNote = async (noteId) => {
    try {
      const noteToUpdate = notes.find((n) => n.id === noteId);
      const updatedNote = { ...noteToUpdate, pinned: !noteToUpdate.pinned };

      // Update the note in the backend
      await axios.put(`http://localhost:8080/api/notes/${noteId}`, updatedNote);

      // Update the note in the frontend
      const updatedNotes = notes.map((n) =>
        n.id === noteId ? updatedNote : n
      );
      setNotes(updatedNotes);
      setFilteredNotes(updatedNotes);
    } catch (error) {
      console.error('Error pinning note:', error);
      alert('Failed to pin the note. Please try again.');
    }
  };

  // Handle deleting a note
  const handleDeleteNote = async (noteId) => {
    try {
      // Delete the note in the backend
      await axios.delete(`http://localhost:8080/api/notes/${noteId}`);

      // Remove the note from the frontend
      const updatedNotes = notes.filter((n) => n.id !== noteId);
      setNotes(updatedNotes);
      setFilteredNotes(updatedNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete the note. Please try again.');
    }
  };
  const handleShareNote = async (note) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: note.title,
          text: `Note: ${note.title}\nContent: ${note.content}\nCreated At: ${new Date(note.createdAt).toLocaleDateString()}`,
        });
        console.log('Note shared successfully!');
      } else {
        alert('Sharing is not supported on this browser.');
      }
    } catch (error) {
      console.error('Error sharing note:', error);
    }
  };
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Your Notes
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
              startIcon={<AddIcon />}
              onClick={handleAddNote}
              sx={{
                width: '100%', // Full width for responsiveness
              }}
            >
              New Note
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {filteredNotes
            .sort((a, b) => b.pinned - a.pinned) // Pinned notes appear first
            .map((note) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
                <NoteCard
                  note={note}
                  onPin={handlePinNote}
                  onDelete={handleDeleteNote}
                  onShare={() => handleShareNote(note)}
                />
              </Grid>
            ))}
        </Grid>
      </Paper>
    </Container>
  );
}

export default NoteList;