// ===== HTML TEMPLATES =====
const T = {
  navbar(user){
    return`<nav class="navbar">
      <div class="navbar-brand" data-go="/dashboard" style="cursor:pointer">
        <svg width="20" height="20" viewBox="0 0 54 54" fill="none" style="vertical-align:middle;margin-right:4px"><rect x="2" y="12" width="34" height="28" rx="8" fill="#ff6b35"/><path d="M36 18L52 10V44L36 36V18Z" fill="#ff8c42" opacity="0.88"/></svg>UzChat
      </div>
      <div class="navbar-menu">
        <span class="nav-coins">💰 ${fmtCoins(user.coins)}</span>
      </div>
    </nav>`;
  },

  bottomTabs(user){
    const path=window.location.pathname;
    return`<div class="bottom-tabs">
      <button class="tab-item ${path==='/dashboard'?'active':''}" data-go="/dashboard">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="8" height="7" rx="2" stroke="currentColor" stroke-width="2"/><rect x="14" y="4" width="8" height="7" rx="2" stroke="currentColor" stroke-width="2"/><rect x="2" y="14" width="8" height="7" rx="2" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="8" height="7" rx="2" stroke="currentColor" stroke-width="2"/></svg>
        <span>Qidirish</span>
      </button>
      <button class="tab-item" data-go="/dashboard">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Match</span>
      </button>
      <button class="tab-item ${path==='/shop'?'active':''}" data-go="/shop">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Do'kon</span>
      </button>
      <button class="tab-item ${path==='/profile'?'active':''}" data-go="/profile">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/><path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <span>Profil</span>
      </button>
      ${user.isAdmin?`<button class="tab-item ${path==='/admin'?'active':''}" data-go="/admin">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <span>Admin</span>
      </button>`:''}
    </div>`;
  },

  sidebar(user){ return ''; },

  layout(user, content){
    return`${T.navbar(user)}<div class="main-content">${content}</div>${T.bottomTabs(user)}`;
  },

  userCard(u, currentUserId){
    const lvl=getLevelColor(u.level);
    const online=u.isOnline;
    return`<div class="user-card fade-in" data-user-id="${u.id}">
      ${online?`<div class="online-badge"></div>`:''}
      <div class="user-avatar">${avatarEmoji(u.gender)}</div>
      <div class="user-name">${u.firstName} ${u.lastName}</div>
      <div class="user-meta">${u.age} yosh · ${u.region}</div>
      <span class="user-level-badge ${lvl}">${getLevelIcon(u.level)} ${u.level}</span><br>
      ${online&&u.id!==currentUserId?`<button class="btn btn-primary btn-sm" onclick="startVideoCall('${u.id}')">📹 Video Qo'ng'iroq</button>`:`<span style="font-size:0.8rem;color:var(--text2)">${online?'Siz':'Oflayn'}</span>`}
    </div>`;
  },

  giftModal(){
    return`<div class="gift-modal-wrap">
      <div class="gift-modal-header">
        <h3>🎁 Sovg'a yuborish</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="gift-modal-grid">
        ${GIFTS.map(g=>`<div class="gift-card gift-tier-${g.tier}" style="--gc:${g.color};--gg:${g.glow}" onclick="sendGift(${g.id})">
          <div class="gift-emoji-box">
            <span class="gift-emoji">${g.emoji}</span>
            <div class="gift-sparkles"><span></span><span></span><span></span><span></span></div>
          </div>
          <div class="gift-name">${g.name}</div>
          <div class="gift-price">💰 ${fmtCoins(g.coins)}</div>
        </div>`).join('')}
      </div>
    </div>`;
  },

  buyModal(pkg){
    return`<div class="modal-header">
      <h3>💰 Coin sotib olish</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div style="text-align:center;padding:20px">
      <div style="font-size:3rem;margin-bottom:16px">💎</div>
      <h2 style="font-size:2rem;color:var(--gold);margin-bottom:8px">${fmtCoins(pkg.coins)} Coin</h2>
      <p style="color:var(--text2);margin-bottom:4px">${pkg.label} paketi</p>
      <p style="font-size:1.4rem;font-weight:700;margin-bottom:24px">${fmtPrice(pkg.price)}</p>

      <div style="background:linear-gradient(135deg,#1a1a2e,#0d0d1a);border-radius:14px;padding:20px;margin-bottom:20px;text-align:left;border:1px solid rgba(255,107,53,0.2)">
        <p style="color:#fff;font-weight:700;font-size:0.95rem;margin-bottom:12px">💳 To'lov kartasi:</p>
        <div style="background:rgba(255,107,53,0.1);border:1.5px dashed rgba(255,107,53,0.4);border-radius:10px;padding:14px;text-align:center;cursor:pointer;margin-bottom:12px" onclick="copyCard()" id="card-display">
          <span style="font-size:1.3rem;font-weight:800;color:#ff6b35;letter-spacing:3px">8600 1234 5678 9012</span>
          <br><span style="font-size:0.75rem;color:rgba(255,255,255,0.5);margin-top:4px;display:block">📋 Nusxalash uchun bosing</span>
        </div>
        <p style="color:rgba(255,255,255,0.6);font-size:0.8rem;line-height:1.6">
          <b style="color:#fff">Qanday to'lash:</b><br>
          1. Yuqoridagi karta raqamini nusxalang<br>
          2. Click/Payme/bank orqali <b style="color:var(--gold)">${fmtPrice(pkg.price)}</b> o'tkazing<br>
          3. To'lov chekini admin'ga yuboring<br>
          4. Coin'lar hisobingizga qo'shiladi ✅
        </p>
      </div>

      <div class="form-group">
        <label>Referal kod (ixtiyoriy)</label>
        <input class="form-control" id="ref-code-input" placeholder="Do'stingiz referal kodini kiriting">
      </div>

      <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:12px;margin-bottom:16px;font-size:0.8rem;color:var(--gold);text-align:left">
        ⚠️ To'lovni amalga oshirgach, "Tasdiqlash" tugmasini bosing. Admin tekshirgandan keyin coin'lar hisobingizga tushadi.
      </div>

      <button class="btn btn-primary btn-block" onclick="confirmBuy(${pkg.id})">✅ To'lovni tasdiqlayman</button>
    </div>`;
  }
};
