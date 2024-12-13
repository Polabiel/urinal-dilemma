import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import { handleConnection, handleGameAction, handleDisconnection } from './src/server/handlers';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  const query = socket.handshake.query as { gameId: string; playerId: string; playerName: string };
  
  handleConnection(socket, io, query);

  socket.on('gameAction', (action) => {
    handleGameAction(io, query.gameId, action);
  });

  socket.on('disconnect', () => {
    handleDisconnection(io, query.gameId, query.playerId);
  });
});

const PORT = process.env.PORT ?? 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
