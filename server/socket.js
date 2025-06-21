let io;

function initSocket(ioInstance) {
  io = ioInstance;

  io.on('connection', (socket) => {
    console.log('⚡ A user connected');

    socket.on('bid', ({ memeId, credits }) => {
      console.log('📢 Bid received:', { memeId, credits });
      io.emit('new-bid', { meme_id: memeId, credits });
    });

    socket.on('vote', ({ memeId, type }) => {
      console.log('📢 Vote received:', { memeId, type });
      io.emit('vote-updated', { meme_id: memeId, change: type === 'up' ? 1 : -1 });
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected');
    });
  });
}

module.exports = { initSocket };
