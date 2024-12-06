// import { NextApiRequest, NextApiResponse } from "next";
// import { Server as SocketIOServer } from "socket.io";
// import { Server as NetServer } from "http";

// let io: SocketIOServer | undefined; // Prevent re-initialization

// export async function GET(req: Request) {
//  // Check if socket server is available
//  if (!req.body?.socket?.server) {
//   // Return a 500 response with an error message
//   return new Response(
//     JSON.stringify({ error: "Socket server is not available" }),
//     { status: 500, headers: { "Content-Type": "application/json" } }
//   );
// }

//   if (!res.socket?.server.io) {
//     // Initialize Socket.IO server if not already initialized
//     const httpServer: NetServer = res.socket.server as any;
//     io = new SocketIOServer(httpServer, {
//       path: "/api/erp/socket.io",
//       cors: {
//         origin: "http://localhost:3000", // Replace with your frontend URL
//         methods: ["GET", "POST"],
//       },
//     });

//     io.on("connection", (socket) => {
//         console.log(`User connected: ${socket.id}`);

//         socket.on("join_forum", (forumId) => {
//           socket.join(`forum_${forumId}`);
//           console.log(`User joined forum: ${forumId}`);
//         });

//         // Handle sending a message
//         socket.on("send_message", (messageData) => {
//           const { forumId } = messageData;
//           io.to(`forum_${forumId}`).emit("receive_message", messageData);
//         });

//       socket.on("disconnect", () => {
//         console.log(`User disconnected: ${socket.id}`);
//       });
//     });

//     res.socket.server.io = io;
//     console.log("Socket.IO server initialized");
//   } else {
//     console.log("Socket.IO server already initialized");
//   }

//   return new Response("Socket is available", { status: 200 }); // Close the HTTP response
// }

// import { Server } from "socket.io";
// import { NextApiRequest, NextApiResponse } from "next";
// import { NextResponse } from "next/server";

// let io: Server;

// export function GET(req: NextApiRequest, res: NextApiResponse){
//   if (!req.socket || !req.socket.server) {
//     console.log('Socket server not found on the response object');
//     return NextResponse.json(
//       { error: 'Socket server is not available' },
//       { status: 500 }
//     );
//   }

//   if (!res.socket.server.io) {
//     console.log('Initializing Socket.IO server...');

//     // Initialize Socket.IO server on the `erp` path
//     io = new Server(res.socket.server, {
//       path: '/api/erp/socket', // Match this path in client side
//     });

//     // Attach the Socket.IO server to the Next.js socket server
//     res.socket.server.io = io;

//     // WebSocket connection logic
//     io.on("connection", (socket) => {
//       console.log("A user connected");

//       // Join a forum
//       socket.on("join_forum", (forumId) => {
//         socket.join(forumId);
//         console.log(`User joined forum: ${forumId}`);
//       });

//       // Leave a forum
//       socket.on("leave_forum", (forumId) => {
//         socket.leave(forumId);
//         console.log(`User left forum: ${forumId}`);
//       });

//       // Handle receiving and broadcasting messages
//       socket.on("send_message", (message) => {
//         const { forumId, content } = message;
//         io.to(`forum_${forumId}`).emit("receive_message", message); // Broadcast to room
//         console.log(`Message sent to forum ${forumId}:`, content);
//       });

//       socket.on("disconnect", () => {
//         console.log("User disconnected");
//       });
//     });
//   } else {
//     console.log("Socket.IO server is already running.");
//   }

//   res.end();
// }

// import { NextResponse } from 'next/server';
// import { Server } from 'socket.io';

// export async function GET(req: Request) {
//   // Use the custom Socket.IO server that was initialized in the custom server setup
//   try {
//     const io = new Server();
//     io.on("connection", (socket) => {
//             console.log(`A user connected with id: ${socket.id}`);

//             // Join a forum
//             socket.on("join_forum", (forumId) => {
//               socket.join(forumId);
//               console.log(`User joined forum: ${forumId}`);
//             });

//             // Leave a forum
//             socket.on("leave_forum", (forumId) => {
//               socket.leave(forumId);
//               console.log(`User left forum: ${forumId}`);
//             });

//             // Handle receiving and broadcasting messages
//             socket.on("send_message", (message) => {
//               const { forumId, content } = message;
//               io.to(`forum_${forumId}`).emit("receive_message", message); // Broadcast to room
//               console.log(`Message sent to forum ${forumId}:`, content);
//             });

//             socket.on("disconnect", () => {
//               console.log("User disconnected");
//             });
//           })

//     return NextResponse.json({ message: 'Socket.IO server is available' });
//   } catch (error) {
//     console.error('Socket.IO error', error);
//     return NextResponse.json({ error: 'Failed to initialize Socket.IO' }, { status: 500 });
//   }
// }

// // server.ts
// import { createServer } from "http";
// import next from "next";
// import socketIo, { Server } from "socket.io";

// // Setup for Next.js
// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = createServer((req, res) => {
//     handle(req, res); // Handle all HTTP requests with Next.js
//   });

//   // Custom Socket.IO server setup
//   const io = new Server();

//   // Handle WebSocket connections
//   io.on("connection", (socket) => {
//     console.log(`A user connected with id: ${socket.id}`);

//     // Join a forum
//     socket.on("join_forum", (forumId: string) => {
//       socket.join(forumId);
//       console.log(`User joined forum: ${forumId}`);
//     });

//     // Leave a forum
//     socket.on("leave_forum", (forumId: string) => {
//       socket.leave(forumId);
//       console.log(`User left forum: ${forumId}`);
//     });

//     // Handle receiving and broadcasting messages
//     socket.on("send_message", (message: { forumId: string; content: string }) => {
//       const { forumId, content } = message;
//       io.to(forumId).emit("receive_message", message); // Broadcast to room
//       console.log(`Message sent to forum ${forumId}:`, content);
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected");
//     });
//   });

//   // Start the server
//   server.listen(3000, (err: any) => {
//     if (err) throw err;
//     console.log("> Ready on http://localhost:3000");
//   });
// });
