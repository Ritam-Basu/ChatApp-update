// server.js
const express = require('express');//
const http = require('http');//
const { Server } = require('socket.io');//

const app = express();//
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server); // Bind Socket.IO to the server

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.get('/',(req,resp)=>{
    resp.sendFile('./pages/index.html',{root:__dirname});
})
// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Example: handle a message event from the client
    socket.on('message', (data) => {
        console.log('Message from client:', data);
        // Emit a message to all connected clients
        io.emit('message', `Server received: ${data}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
