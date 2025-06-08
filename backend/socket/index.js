// socket/index.js
export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a room (one-to-one chat room)
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    // Receive and forward a private message
    socket.on('private-message', ({ roomId, message }) => {
      io.to(roomId).emit('private-message', {
        sender: socket.id,
        message,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
