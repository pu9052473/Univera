const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const next = require('next');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Enable CORS for API routes
  server.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST"] }));

  // Create HTTP server from Express app
  const httpServer = http.createServer(server);

  // Enable Socket.IO with CORS settings
  const io = socketIo(httpServer, {
    cors: {
      origin: "http://localhost:3000", // Frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Socket.IO connection and events
  io.on('connection', (socket) => {
    console.log('a user connected with id:', socket.id);

    socket.on('join_forum', (forumId) => {
      socket.join(forumId);
      console.log(`User joined forum: ${forumId}`);
    });

    socket.on('leave_forum', (forumId) => {
      socket.leave(forumId);
      console.log(`User left forum: ${forumId}`);
    });

    socket.on('send_message', (newMessage) => {
      const { forumId, message } = newMessage;
      io.to(forumId).emit('receive_message', newMessage); // Broadcast to forum room
      console.log(`Message sent to forum ${forumId}:`, message);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  // Serve the Next.js pages
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server on port 3000
  const port = 3000;
  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
