import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import socketHandler from './sockets/chat.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load variables
dotenv.config();

// Connect DB
connectDB();

const app = express();
const server = http.createServer(app);

// Configure socket server with CORS
const io = new Server(server, {
  cors: {
    origin: '*', // Allows broad visual client simulations
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST Routes
app.use('/api/auth', authRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: '🛰️ Discussion Forum Server is Live & Secure' });
});

// Attach socket logic
socketHandler(io);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
