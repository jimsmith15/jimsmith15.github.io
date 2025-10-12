const WebSocket = require('ws');
const http = require('http');
const url = require('url');

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients and rooms
const clients = new Map();
const rooms = new Map();

// Generate unique room codes
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Broadcast message to all clients in a room
function broadcastToRoom(roomCode, message, excludeClient = null) {
  const room = rooms.get(roomCode);
  if (!room) return;

  room.forEach(client => {
    if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Send user list to all clients in a room
function sendUserList(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const users = Array.from(room)
    .filter(client => client.username)
    .map(client => client.username);

  const message = {
    type: 'userList',
    users: users
  };

  broadcastToRoom(roomCode, message);
}

wss.on('connection', (ws, req) => {
  console.log('New client connected');
  
  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'join':
          handleJoin(ws, message);
          break;
        case 'createRoom':
          handleCreateRoom(ws, message);
          break;
        case 'chat':
          handleChat(ws, message);
          break;
        case 'typing':
          handleTyping(ws, message);
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  // Handle client disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
    
    // Remove client from room
    if (ws.roomCode) {
      const room = rooms.get(ws.roomCode);
      if (room) {
        room.delete(ws);
        
        // Send user left message
        if (ws.username) {
          const leaveMessage = {
            type: 'system',
            content: `${ws.username} left the chat`,
            timestamp: new Date().toISOString()
          };
          broadcastToRoom(ws.roomCode, leaveMessage);
          
          // Update user list
          sendUserList(ws.roomCode);
        }
        
        // Clean up empty rooms
        if (room.size === 0) {
          rooms.delete(ws.roomCode);
          console.log(`Room ${ws.roomCode} deleted (empty)`);
        }
      }
    }
    
    // Remove from clients map
    clients.delete(ws);
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

function handleJoin(ws, message) {
  const { username, roomCode } = message;
  
  if (!username || !roomCode) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Username and room code are required'
    }));
    return;
  }

  // Check if room exists
  if (!rooms.has(roomCode)) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Room not found'
    }));
    return;
  }

  // Check if username is already taken in this room
  const room = rooms.get(roomCode);
  const existingUser = Array.from(room).find(client => client.username === username);
  
  if (existingUser) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Username already taken in this room'
    }));
    return;
  }

  // Add client to room
  ws.username = username;
  ws.roomCode = roomCode;
  room.add(ws);
  clients.set(ws, { username, roomCode });

  // Send join confirmation
  ws.send(JSON.stringify({
    type: 'joined',
    roomCode: roomCode,
    username: username
  }));

  // Notify other users
  const joinMessage = {
    type: 'system',
    content: `${username} joined the chat`,
    timestamp: new Date().toISOString()
  };
  broadcastToRoom(roomCode, joinMessage, ws);

  // Send current user list
  sendUserList(roomCode);

  console.log(`${username} joined room ${roomCode}`);
}

function handleCreateRoom(ws, message) {
  const { username } = message;
  
  if (!username) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Username is required'
    }));
    return;
  }

  // Generate unique room code
  let roomCode;
  do {
    roomCode = generateRoomCode();
  } while (rooms.has(roomCode));

  // Create new room
  const room = new Set();
  rooms.set(roomCode, room);

  // Add client to room
  ws.username = username;
  ws.roomCode = roomCode;
  room.add(ws);
  clients.set(ws, { username, roomCode });

  // Send room creation confirmation
  ws.send(JSON.stringify({
    type: 'roomCreated',
    roomCode: roomCode,
    username: username
  }));

  console.log(`Room ${roomCode} created by ${username}`);
}

function handleChat(ws, message) {
  const { content } = message;
  
  if (!ws.username || !ws.roomCode || !content) {
    return;
  }

  const chatMessage = {
    type: 'message',
    sender: ws.username,
    content: content,
    timestamp: new Date().toISOString()
  };

  // Broadcast to all users in the room
  broadcastToRoom(ws.roomCode, chatMessage);
  
  console.log(`${ws.username} in room ${ws.roomCode}: ${content}`);
}

function handleTyping(ws, message) {
  if (!ws.username || !ws.roomCode) {
    return;
  }

  const typingMessage = {
    type: 'typing',
    username: ws.username,
    isTyping: message.isTyping
  };

  // Broadcast typing status to other users in the room
  broadcastToRoom(ws.roomCode, typingMessage, ws);
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
