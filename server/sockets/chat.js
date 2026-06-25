import Message from '../models/Message.js';

// In-memory store for active users in each discussion room
// Key: discussionId, Value: Array of { socketId, userId, username, avatar }
const roomActiveUsers = {};

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // User joins a discussion room
    socket.on('join-room', async ({ discussionId, user }) => {
      if (!discussionId || !user) return;

      socket.join(discussionId);
      console.log(`👤 User [${user.username}] joined room: ${discussionId}`);

      // Initialize room active users if not exists
      if (!roomActiveUsers[discussionId]) {
        roomActiveUsers[discussionId] = [];
      }

      // Check if user is already registered in this room with this socket
      const exists = roomActiveUsers[discussionId].some(
        (u) => u.socketId === socket.id
      );

      if (!exists) {
        roomActiveUsers[discussionId].push({
          socketId: socket.id,
          userId: user._id,
          username: user.username,
          avatar: user.avatar,
        });
      }

      // Emit updated active user list to the room
      io.to(discussionId).emit('room-users', roomActiveUsers[discussionId]);
    });

    // User sends a real-time message
    socket.on('send-message', async ({ discussionId, userId, text }) => {
      if (!discussionId || !userId || !text || text.trim() === '') return;

      try {
        // Save to database
        const message = await Message.create({
          discussion: discussionId,
          user: userId,
          text: text.trim(),
        });

        // Populate user details for real-time broadcast
        const populatedMessage = await Message.findById(message._id)
          .populate('user', 'username avatar');

        // Broadcast message to everyone in the room
        io.to(discussionId).emit('receive-message', populatedMessage);
      } catch (error) {
        console.error('Socket message save error:', error.message);
      }
    });

    // Typing Indicators
    socket.on('typing', ({ discussionId, username }) => {
      socket.to(discussionId).emit('user-typing', { username });
    });

    socket.on('stop-typing', ({ discussionId }) => {
      socket.to(discussionId).emit('user-stop-typing');
    });

    // User leaves room explicitly
    socket.on('leave-room', ({ discussionId }) => {
      if (!discussionId) return;

      socket.leave(discussionId);

      if (roomActiveUsers[discussionId]) {
        roomActiveUsers[discussionId] = roomActiveUsers[discussionId].filter(
          (u) => u.socketId !== socket.id
        );
        io.to(discussionId).emit('room-users', roomActiveUsers[discussionId]);
      }
      console.log(`👤 Socket [${socket.id}] left room: ${discussionId}`);
    });

    // Dynamic Disconnection handling
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);

      // Scan all rooms to remove this socket's presence
      Object.keys(roomActiveUsers).forEach((discussionId) => {
        const initialCount = roomActiveUsers[discussionId].length;
        roomActiveUsers[discussionId] = roomActiveUsers[discussionId].filter(
          (u) => u.socketId !== socket.id
        );

        // If changes occurred, notify remaining room subscribers
        if (roomActiveUsers[discussionId].length !== initialCount) {
          io.to(discussionId).emit('room-users', roomActiveUsers[discussionId]);
        }

        // Clean up empty room registry keys
        if (roomActiveUsers[discussionId].length === 0) {
          delete roomActiveUsers[discussionId];
        }
      });
    });
  });
};

export default socketHandler;
