import React from 'react';
import { Card, CardContent, CardActions, Typography, IconButton, Box, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

// Utility function to calculate brightness of a color
const getBrightness = (hexColor) => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Calculate brightness using the formula
  return (r * 299 + g * 587 + b * 114) / 1000;
};

function TaskCard({ task, onDelete, onToggleComplete }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/task/${task.id}`);
  };

  // Determine text color based on brightness
  const brightness = getBrightness(task.color || '#ffffff');
  const textColor = brightness > 128 ? 'black' : 'white'; // Use black for light colors, white for dark colors

  return (
    <Card
      sx={{
        mb: 2,
        backgroundColor: task.color || '#ffffff', // Apply the task color or default to white
        color: textColor, // Dynamically set text color
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Checkbox
            checked={task.completed}
            onChange={onToggleComplete}
            sx={{ mr: 2, color: textColor }} // Match checkbox color to text color
          />
          <Typography
            variant="h6"
            sx={{
              textDecoration: task.completed ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: textColor }}>
          {task.description}
        </Typography>
        <Typography variant="caption" sx={{ color: textColor }}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={handleEdit} sx={{ color: textColor }}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={onDelete} sx={{ color: textColor }}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default TaskCard;