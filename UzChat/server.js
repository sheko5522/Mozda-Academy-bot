const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Sovg'a rasmlarini avtomatik ko'chirish
const imgDir = path.join(__dirname, 'img');
if(!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, {recursive:true});
const geminiDir = path.join(require('os').homedir(), '.gemini', 'antigravity', 'brain', 'a50053d4-f39f-44f3-a66a-8058cfe207d7');
const giftMap = {
  'gift_rose': 'gift_rose_1779274088398.png',
  'gift_heart': 'gift_heart_1779274103652.png',
  'gift_star': 'gift_star_1779274117962.png',
  'gift_diamond': 'gift_diamond_1779274130086.png',
  'gift_crown': 'gift_crown_1779274144818.png',
  'gift_airplane': 'gift_airplane_1779274168724.png'
};
Object.entries(giftMap).forEach(([name, src]) => {
  const dest = path.join(imgDir, name + '.png');
  if(!fs.existsSync(dest)){
    const srcPath = path.join(geminiDir, src);
    if(fs.existsSync(srcPath)){
      fs.copyFileSync(srcPath, dest);
      console.log(`📦 Copied: ${name}.png`);
    }
  }
});

app.use(express.static(__dirname));
app.use(express.json());

// userId -> socketId mapping
const userSockets = new Map();
// socketId -> userId
const socketUsers = new Map();

function getSocketByUserId(userId) {
  const socketId = userSockets.get(userId);
  return socketId ? io.sockets.sockets.get(socketId) : null;
}

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  socket.on('user-join', (userId) => {
    userSockets.set(userId, socket.id);
    socketUsers.set(socket.id, userId);
    socket.userId = userId;
    console.log('User joined:', userId);
    // Broadcast online list
    io.emit('online-users', Array.from(userSockets.keys()));
  });

  socket.on('call-user', ({ targetUserId, offer, callerInfo }) => {
    const targetSock = getSocketByUserId(targetUserId);
    if (targetSock) {
      targetSock.emit('incoming-call', {
        from: socket.userId,
        callerInfo,
        offer
      });
    } else {
      socket.emit('call-failed', { reason: 'Foydalanuvchi online emas' });
    }
  });

  socket.on('accept-call', ({ targetUserId, answer }) => {
    const targetSock = getSocketByUserId(targetUserId);
    if (targetSock) targetSock.emit('call-accepted', { answer, from: socket.userId });
  });

  socket.on('reject-call', ({ targetUserId }) => {
    const targetSock = getSocketByUserId(targetUserId);
    if (targetSock) targetSock.emit('call-rejected', { from: socket.userId });
  });

  socket.on('ice-candidate', ({ targetUserId, candidate }) => {
    const targetSock = getSocketByUserId(targetUserId);
    if (targetSock) targetSock.emit('ice-candidate', { candidate, from: socket.userId });
  });

  socket.on('end-call', ({ targetUserId }) => {
    const targetSock = getSocketByUserId(targetUserId);
    if (targetSock) targetSock.emit('call-ended', { from: socket.userId });
  });

  socket.on('disconnect', () => {
    const userId = socketUsers.get(socket.id);
    if (userId) {
      userSockets.delete(userId);
      socketUsers.delete(socket.id);
      io.emit('online-users', Array.from(userSockets.keys()));
    }
    console.log('Disconnected:', socket.id);
  });
});

// SPA: barcha routelarni index.html ga yo'naltirish
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ UzChat server ishga tushdi: http://localhost:${PORT}`);
});
