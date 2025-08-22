import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  TextField,
  Divider,
} from '@mui/material';
import api from '../services/api';

// Manually defining the type based on the backend DTO
interface Profile {
  userId: string;
  name: string;
  age: number;
  studentYear: number;
  major: string;
  gender: string;
}

const HomePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [matchCount, setMatchCount] = useState<number | string>(2);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/users/me');
        setProfile(response.data);
      } catch (err) {
        setError('Failed to fetch profile. You might need to log in again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleCreateMatch = async () => {
    try {
      const response = await api.post('/api/match/create', { wantedMatchCount: Number(matchCount) });
      alert(response.data || 'Match request created successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create match request.');
      console.error(err);
    }
  };

  const handleCancelMatch = async () => {
    try {
      const response = await api.delete('/api/match/cancel');
      alert(response.data || 'Match request canceled successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel match request.');
      console.error(err);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {profile?.name}!
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Your Profile</Typography>
          <Typography><b>User ID:</b> {profile?.userId}</Typography>
          <Typography><b>Major:</b> {profile?.major}</Typography>
          <Typography><b>Age:</b> {profile?.age}</Typography>
          <Typography><b>Gender:</b> {profile?.gender}</Typography>
        </CardContent>
      </Card>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Matching Dashboard</Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom><b>Find a new match</b></Typography>
          <TextField
            label="Number of people"
            type="number"
            value={matchCount}
            onChange={(e) => setMatchCount(e.target.value)}
            sx={{ mr: 2, width: '200px' }}
            InputProps={{ inputProps: { min: 2 } }}
          />
          <Button variant="contained" color="primary" onClick={handleCreateMatch} sx={{ mr: 2 }}>
            Start Matching
          </Button>
          <Button variant="outlined" color="error" onClick={handleCancelMatch}>
            Cancel Matching
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default HomePage;
