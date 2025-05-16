const { setupChangeStream } = require('../controllers/notificationController');

module.exports = (io) => {
  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log('Frontend connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Frontend disconnected:', socket.id);
    });
  });

  // Initialize MongoDB Change Stream
  setupChangeStream(io);
};