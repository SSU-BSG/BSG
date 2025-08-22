import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AuthPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [studentYear, setStudentYear] = useState<number | ''>('');
  const [major, setMajor] = useState('');
  const [gender, setGender] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/api/auth/sign-in', { userId, password });
      if (response.data.accessToken) {
        login(response.data.accessToken);
        navigate('/');
      }
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
      console.error(err);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/api/auth/sign-up', {
        userId,
        password,
        name,
        age: Number(age),
        studentYear: Number(studentYear),
        major,
        gender,
      });
      setSuccess('Sign up successful! Please log in.');
      setTabIndex(0); // Switch to login tab
    } catch (err) {
      setError('Failed to sign up. Please check your information.');
      console.error(err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setError('');
    setSuccess('');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>
        </Box>
        
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <TabPanel value={tabIndex} index={0}>
          <Typography component="h1" variant="h5" align="center">Login</Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth label="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} autoFocus />
            <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Login</Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <Typography component="h1" variant="h5" align="center">Sign Up</Typography>
          <Box component="form" onSubmit={handleSignup} sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth label="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <TextField margin="normal" required fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField margin="normal" required fullWidth label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))} />
            <TextField margin="normal" required fullWidth label="Student Year" type="number" value={studentYear} onChange={(e) => setStudentYear(e.target.value === '' ? '' : parseInt(e.target.value, 10))} />
            <TextField margin="normal" required fullWidth label="Major" value={major} onChange={(e) => setMajor(e.target.value)} />
            <TextField margin="normal" required fullWidth label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AuthPage;
