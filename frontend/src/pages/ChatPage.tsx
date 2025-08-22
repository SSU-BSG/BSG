import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { createSocket } from '../services/socket';
import { Socket } from 'socket.io-client';

// Manually defining types based on backend entities
interface Message {
  id: number;
  content: string;
  createdAt: string;
  sender: {
    id: number;
    name: string;
  };
}

const ChatPage = () => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [matchGroupId, setMatchGroupId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (token) {
      const newSocket = createSocket(token);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from chat server');
        setIsConnected(false);
      });

      newSocket.on('previousMessages', (prevMessages: Message[]) => {
        setMessages(prevMessages);
      });

      newSocket.on('newMessage', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoinRoom = () => {
    if (socket && matchGroupId) {
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit('joinRoom', { matchGroupId: Number(matchGroupId) });
      setIsConnected(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && newMessage.trim() && matchGroupId) {
      socket.emit('sendMessage', {
        matchGroupId: Number(matchGroupId),
        content: newMessage,
      });
      setNewMessage('');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Chat Room
        </Typography>
        <Divider />
        {!isConnected ? (
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <TextField
              label="Enter Match Group ID"
              value={matchGroupId}
              onChange={(e) => setMatchGroupId(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
            />
            <Button onClick={handleJoinRoom} variant="contained">
              Join Chat
            </Button>
          </Box>
        ) : (
          <>
            <List sx={{ height: '60vh', overflowY: 'auto', my: 2 }}>
              {messages.map((msg) => (
                <ListItem key={msg.id}>
                  <ListItemText
                    primary={msg.content}
                    secondary={`${msg.sender.name} - ${new Date(msg.createdAt).toLocaleTimeString()}`}
                  />
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
            <Divider />
            <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, display: 'flex' }}>
              <TextField
                fullWidth
                label="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                variant="outlined"
                size="small"
              />
              <Button type="submit" variant="contained" sx={{ ml: 2 }}>
                Send
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ChatPage;
