// ===== HANDLERS =====
let _callInterval = null;
const Handlers = {
  applyFilters() {
    const region = document.getElementById('f-region').value;
    const gender = document.getElementById('f-gender').value;
    const age = document.getElementById('f-age').value;
    const level = document.getElementById('f-level').value;
    const user = DB.getCurrentUser();
    let users = DB.getUsers().filter(u => !u.isBlocked);
    if (region) users = users.filter(u => u.region === region);
    if (gender) users = users.filter(u => u.gender === gender);
    if (age) { const [mn, mx] = age.split('-').map(Number); users = users.filter(u => u.age >= mn && u.age <= mx); }
    if (level) users = users.filter(u => u.level === level);
    const grid = document.getElementById('users-grid');
    grid.innerHTML = users.length ? users.map(u => T.userCard(u, user.id)).join('') : '<div class="empty-state"><div class="empty-state-icon">🔍</div><h3>Foydalanuvchi topilmadi</h3><p>Filter shartlarini o\'zgartiring</p></div>';
  },
  clearFilters() {
    ['f-region', 'f-gender', 'f-age', 'f-level'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    Handlers.applyFilters();
  },
  confirmBuy(pkgId) {
    const pkg = COIN_PACKAGES.find(p => p.id === pkgId);
    if (!pkg) return;
    const user = DB.getCurrentUser();
    const refInput = document.getElementById('ref-code-input');
    const refCode = refInput ? refInput.value.trim().toUpperCase() : '';
    const referrer = refCode ? DB.getUserByReferral(refCode) : null;
    const newCoins = user.coins + pkg.coins;
    const newTotal = user.totalCoinsBought + pkg.coins;
    const newLevel = getLevel(newTotal);
    DB.updateUser(user.id, { coins: newCoins, totalCoinsBought: newTotal, level: newLevel });
    DB.addTransaction({ id: genId(), userId: user.id, type: 'credit', amount: pkg.coins, desc: `Sotib olindi: ${pkg.label} paketi`, createdAt: new Date().toISOString() });
    if (referrer && referrer.id !== user.id) {
      const bonus = Math.floor(pkg.coins * REFERRAL_BONUS_PERCENT / 100);
      DB.updateUser(referrer.id, { coins: referrer.coins + bonus });
      DB.addTransaction({ id: genId(), userId: referrer.id, type: 'credit', amount: bonus, desc: `Referal bonus (${user.firstName})`, createdAt: new Date().toISOString() });
    }
    closeModal();
    toast(`🎉 ${fmtCoins(pkg.coins)} coin hisobingizga qo'shildi!`);
    setTimeout(() => Pages.shop(), 300);
  },
  sendGift(giftId) {
    const gift = GIFTS.find(g => g.id === giftId);
    const user = DB.getCurrentUser();
    if (!gift) return;
    if (user.coins < gift.coins) { toast('Coin yetarli emas!', 'error'); return; }
    const targetId = window._callTargetId;
    DB.updateUser(user.id, { coins: user.coins - gift.coins });
    DB.addTransaction({ id: genId(), userId: user.id, type: 'debit', amount: gift.coins, desc: `Sovg'a yuborildi: ${gift.name}`, createdAt: new Date().toISOString() });
    closeModal();
    toast(`${gift.emoji} ${gift.name} sovg'asi yuborildi!`);
    const display = document.getElementById('coin-display');
    if (display) { const u = DB.getCurrentUser(); display.textContent = fmtCoins(u.coins); }
  },
  startCallTimer(user, target) {
    let secs = 0;
    const startCoins = user.coins;
    _callInterval = setInterval(() => {
      secs++;
      const el = document.getElementById('call-timer');
      if (!el) { clearInterval(_callInterval); return; }
      el.textContent = fmtTime(secs);
      if (secs % 60 === 0) {
        const u = DB.getCurrentUser();
        if (u.coins < COIN_PER_MINUTE) { Handlers.endCall(true); return; }
        DB.updateUser(u.id, { coins: u.coins - COIN_PER_MINUTE });
        DB.addTransaction({ id: genId(), userId: u.id, type: 'debit', amount: COIN_PER_MINUTE, desc: `Video suhbat: ${target.firstName}`, createdAt: new Date().toISOString() });
        const d = document.getElementById('coin-display');
        const fresh = DB.getCurrentUser();
        if (d) d.textContent = fmtCoins(fresh.coins);
        const bar = document.getElementById('coin-bar');
        if (bar) bar.style.width = Math.max(0, (fresh.coins / startCoins) * 100) + '%';
      }
    }, 1000);
  },
  endCall(auto = false) {
    clearInterval(_callInterval);
    const u = DB.getCurrentUser();
    DB.addTransaction({ id: genId(), userId: u.id, type: 'debit', amount: 0, desc: 'Video suhbat yakunlandi', createdAt: new Date().toISOString() });
    toast(auto ? '⏰ Coin tugadi, suhbat yakunlandi' : '📵 Suhbat yakunlandi', 'info');
    Router.go('/dashboard');
  },
  toggleBlock(userId) {
    const u = DB.getUserById(userId);
    if (!u) return;
    DB.updateUser(userId, { isBlocked: !u.isBlocked });
    toast(u.isBlocked ? `✅ ${u.firstName} blokdan chiqarildi` : `🚫 ${u.firstName} bloklandi`);
    Pages.admin();
  },
  requestWithdrawal() {
    const amountInput = document.getElementById('withdraw-amount');
    if (!amountInput) return;
    const coins = parseInt(amountInput.value);
    const user = DB.getCurrentUser();
    if (!coins || coins < MIN_WITHDRAWAL_COINS) {
      toast(`Kamida ${fmtCoins(MIN_WITHDRAWAL_COINS)} coin kiritng!`, 'error');
      return;
    }
    if (coins > user.coins) {
      toast('Yetarli coin mavjud emas!', 'error');
      return;
    }
    const somAmount = coins * COIN_SELL_RATE;
    DB.updateUser(user.id, { coins: user.coins - coins });
    DB.addTransaction({ id: genId(), userId: user.id, type: 'debit', amount: coins, desc: `Pul chiqarish: ${fmtCoins(somAmount)} so'm`, createdAt: new Date().toISOString() });
    closeModal();
    toast(`✅ ${fmtCoins(somAmount)} so'm chiqarish so'rovi yuborildi! Admin 24 soat ichida o'tkazadi.`);
    setTimeout(() => Pages.profile(), 300);
  }
};
