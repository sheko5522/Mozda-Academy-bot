// ===== SOCKET + WebRTC CLIENT =====
const STUN_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

let socket = null;
let peerConnection = null;
let localStream = null;
let currentCallTarget = null;
let callInterval = null;

// ---- SOCKET INIT ----
function initSocket(userId) {
  if (socket && socket.connected) return;
  socket = io();
  socket.emit('user-join', userId);

  socket.on('online-users', (userIds) => {
    window._onlineUserIds = userIds;
    // Update UI if dashboard is open
    document.querySelectorAll('.user-card').forEach(card => {
      const uid = card.dataset.userId;
      const dot = card.querySelector('.online-badge');
      if (dot) dot.style.display = userIds.includes(uid) ? 'block' : 'none';
    });
  });

  socket.on('incoming-call', ({ from, callerInfo, offer }) => {
    window._pendingOffer = offer;
    window._pendingFrom = from;
    showIncomingCallModal(callerInfo, from);
  });

  socket.on('call-accepted', async ({ answer, from }) => {
    if (!peerConnection) return;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on('call-rejected', () => {
    toast('📵 Qo\'ng\'iroq rad etildi', 'error');
    cleanupCall();
    Router.go('/dashboard');
  });

  socket.on('ice-candidate', async ({ candidate }) => {
    if (peerConnection && candidate) {
      try { await peerConnection.addIceCandidate(new RTCIceCandidate(candidate)); } catch(e) {}
    }
  });

  socket.on('call-ended', () => {
    toast('📵 Suhbat yakunlandi', 'info');
    cleanupCall();
    Router.go('/dashboard');
  });

  socket.on('call-failed', ({ reason }) => {
    toast(reason, 'error');
    cleanupCall();
  });
}

// ---- SHOW INCOMING CALL ----
function showIncomingCallModal(callerInfo, fromId) {
  const name = callerInfo ? `${callerInfo.firstName} ${callerInfo.lastName}` : 'Noma\'lum';
  openModal(`
    <div style="text-align:center;padding:20px">
      <div style="font-size:4rem;margin-bottom:12px;animation:pulse 1s infinite">📹</div>
      <h2 style="margin-bottom:8px">${name}</h2>
      <p style="color:var(--text2);margin-bottom:28px">Sizni video qo'ng'iroqqa taklif qilmoqda...</p>
      <div style="display:flex;gap:16px;justify-content:center">
        <button class="btn btn-danger" onclick="rejectCall('${fromId}')">📵 Rad etish</button>
        <button class="btn btn-primary" onclick="acceptCall('${fromId}')">✅ Qabul qilish</button>
      </div>
    </div>
  `);
}

// ---- ACCEPT CALL ----
window.acceptCall = async (fromId) => {
  closeModal();
  currentCallTarget = fromId;
  const user = DB.getCurrentUser();
  if (user.coins < 10) { toast('Coin yetarli emas!', 'error'); return; }

  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    Router.go('/video', { targetId: fromId, isCallee: true });

    // Wait for video page to render
    setTimeout(async () => {
      setupLocalVideo();
      peerConnection = createPeerConnection(fromId);
      localStream.getTracks().forEach(t => peerConnection.addTrack(t, localStream));

      await peerConnection.setRemoteDescription(new RTCSessionDescription(window._pendingOffer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('accept-call', { targetUserId: fromId, answer });
    }, 500);
  } catch(e) {
    toast('Kamera/mikrofon ruxsati berilmadi!', 'error');
  }
};

// ---- REJECT CALL ----
window.rejectCall = (fromId) => {
  socket.emit('reject-call', { targetUserId: fromId });
  closeModal();
};

// ---- START CALL (caller) ----
window.startVideoCall = async (targetId) => {
  const user = DB.getCurrentUser();
  if (!user) return;
  if (user.coins < 10) { toast('Coin yetarli emas! Avval coin sotib oling.', 'error'); Router.go('/shop'); return; }

  currentCallTarget = targetId;
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    Router.go('/video', { targetId, isCallee: false });

    setTimeout(async () => {
      setupLocalVideo();
      peerConnection = createPeerConnection(targetId);
      localStream.getTracks().forEach(t => peerConnection.addTrack(t, localStream));

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const target = DB.getUserById(targetId);
      socket.emit('call-user', {
        targetUserId: targetId,
        offer,
        callerInfo: { firstName: user.firstName, lastName: user.lastName }
      });
    }, 500);
  } catch(e) {
    toast('Kamera/mikrofon ruxsati berilmadi! Brauzer sozlamalarini tekshiring.', 'error');
    cleanupCall();
  }
};

// ---- CREATE PEER CONNECTION ----
function createPeerConnection(targetId) {
  const pc = new RTCPeerConnection(STUN_SERVERS);

  pc.onicecandidate = (e) => {
    if (e.candidate) socket.emit('ice-candidate', { targetUserId: targetId, candidate: e.candidate });
  };

  pc.ontrack = (e) => {
    const remoteVideo = document.getElementById('remote-video');
    if (remoteVideo && e.streams[0]) remoteVideo.srcObject = e.streams[0];
  };

  pc.onconnectionstatechange = () => {
    console.log('Connection state:', pc.connectionState);
    if (pc.connectionState === 'connected') {
      startCoinTimer();
    }
  };

  return pc;
}

// ---- SETUP LOCAL VIDEO ----
function setupLocalVideo() {
  const localVideo = document.getElementById('local-video');
  if (localVideo && localStream) {
    localVideo.srcObject = localStream;
    // Placeholder'ni yashirish
    const ph = document.getElementById('local-placeholder');
    if(ph) ph.style.display='none';
  }
}

// ---- COIN TIMER ----
function startCoinTimer() {
  let secs = 0;
  const user = DB.getCurrentUser();
  callInterval = setInterval(() => {
    secs++;
    const timerEl = document.getElementById('call-timer');
    if (timerEl) timerEl.textContent = fmtTime(secs);

    if (secs % 60 === 0) {
      const fresh = DB.getCurrentUser();
      if (fresh.coins < COIN_PER_MINUTE) {
        toast('⏰ Coin tugadi!', 'error');
        endVideoCall();
        return;
      }
      const newCoins = fresh.coins - COIN_PER_MINUTE;
      DB.updateUser(fresh.id, { coins: newCoins });
      DB.addTransaction({ id: genId(), userId: fresh.id, type: 'debit', amount: COIN_PER_MINUTE, desc: 'Video suhbat', createdAt: new Date().toISOString() });
      const coinEl = document.getElementById('coin-display');
      if (coinEl) coinEl.textContent = '💰 ' + fmtCoins(newCoins);
    }
  }, 1000);
}

// ---- END CALL ----
window.endVideoCall = () => {
  if (currentCallTarget) socket.emit('end-call', { targetUserId: currentCallTarget });
  cleanupCall();
  Router.go('/dashboard');
};

function cleanupCall() {
  if (callInterval) { clearInterval(callInterval); callInterval = null; }
  if (peerConnection) { peerConnection.close(); peerConnection = null; }
  if (localStream) { localStream.getTracks().forEach(t => t.stop()); localStream = null; }
  currentCallTarget = null;
}
