const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")

const app = express()
// Enable CORS for API routes
app.use(cors({ 
  origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000", 
  methods: ["GET", "POST"],
  credentials: true,
}))


// Create HTTP server from Express app
const server = http.createServer(app);

// Enable CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
})

// Socket.IO connection and events
io.on("connection", (socket) => {
  console.log("a user connected with id:", socket.id)

  socket.on("join_forum", (forumId) => {
    socket.join(forumId)
    console.log(`User joined forum: ${forumId}`)
  })

  socket.on("leave_forum", (forumId) => {
    socket.leave(forumId)
    console.log(`User left forum: ${forumId}`)
  })

  socket.on("send_message", (newMessage) => {
    const { forumId, message } = newMessage
    io.to(forumId).emit("receive_message", newMessage) // Broadcast to forum room
    console.log(`Message sent to forum ${forumId}:`, message)
  })

  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
})

// Serve the Next.js pages
app.all("*", (req, res) => {
  return handle(req, res)
})

// Start the server on port 3001
const port = process.env.NEXT_PUBLIC_PORT 
server.listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
})
