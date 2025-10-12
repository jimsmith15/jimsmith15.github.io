# Real-Time Chatroom

A modern, real-time chatroom application built with WebSocket technology that allows you to chat with friends anywhere in the world.

## Features

- 🚀 **Real-time messaging** - Instant message delivery via WebSocket
- 🏠 **Room system** - Create private rooms with unique codes
- 👥 **User management** - See who's online in your room
- ⌨️ **Typing indicators** - Know when someone is typing
- 📱 **Responsive design** - Works on desktop and mobile
- 🎨 **Modern UI** - Beautiful glassmorphism design
- 🔄 **Auto-reconnection** - Automatically reconnects if connection drops

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

The server will start on port 3000.

### 3. Open the Chatroom
Open `index.html` in your web browser.

## How to Use

### Creating a Room
1. Enter your nickname
2. Click "Create New Room"
3. Share the generated room code with your friend
4. Start chatting!

### Joining a Room
1. Enter your nickname
2. Enter the room code your friend shared
3. Click "Join Room"
4. Start chatting!

## Room Codes

- Room codes are 6 characters long (e.g., "ABC123")
- They're automatically generated when creating a room
- Share the code with anyone you want to invite
- Rooms are private - only people with the code can join

## Technical Details

### Server (Node.js + WebSocket)
- Built with Node.js and the `ws` library
- Handles multiple concurrent connections
- Manages rooms and user sessions
- Broadcasts messages in real-time

### Client (HTML + JavaScript)
- Pure vanilla JavaScript (no frameworks)
- WebSocket client for real-time communication
- Responsive CSS with modern design
- Local storage for connection persistence

## Deployment

### Local Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Production Deployment
1. Deploy the server to a cloud platform (Heroku, Railway, etc.)
2. Update the WebSocket URL in `index.html` if needed
3. Serve the HTML file from a web server

### Environment Variables
- `PORT` - Server port (default: 3000)

## Security Notes

- Messages are not stored on the server
- Room codes are randomly generated
- No user authentication required
- Messages are only visible to room participants

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

## Troubleshooting

### Connection Issues
- Check that the server is running on port 3000
- Ensure your firewall allows WebSocket connections
- Try refreshing the page

### Room Not Found
- Verify the room code is correct (case-sensitive)
- Make sure the room creator is still online
- Try creating a new room

## License

MIT License - Feel free to use and modify!
