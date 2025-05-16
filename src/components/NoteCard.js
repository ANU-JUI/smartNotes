import React from 'react';
import { Card, CardContent, CardActions, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PushPinIcon from '@mui/icons-material/PushPin';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom';

const isDarkColor = (color) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128; // If brightness is less than 128, it's a dark color
};

function NoteCard({ note, onPin, onDelete , onShare }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/note/${note.id}`);
  };

  // Format the createdAt date to display only the date
  const formattedDate = new Date(note.createdAt).toLocaleDateString();

  const textColor = isDarkColor(note.color || '#ffffff') ? 'white' : 'black';

  return (
    <Card
      sx={{
        height: '100%',
        width: '120%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: note.color || 'white',
        color: textColor,
        border: '1px solid #ddd',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div">
          {note.title}
        </Typography>
        <Typography variant="body2">
          {note.content}
        </Typography>
        <Typography variant="body2" color="InactiveCaptionText" sx={{ mt: 1 }}>
          {formattedDate}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={() => onPin(note.id)}>
          <PushPinIcon color={note.pinned ? 'primary' : 'action'} />
        </IconButton>
        <IconButton onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(note.id)}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={() => onShare(note)}>
          <ShareIcon color="action" /> 
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default NoteCard;