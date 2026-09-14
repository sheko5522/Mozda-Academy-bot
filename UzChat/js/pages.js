const Pages = {
  home(){
    // O'zbek shaharlari ro'yxati
    const regions = ['Toshkent','Samarqand','Farg\'ona','Andijon','Namangan','Buxoro','Qarshi','Navoiy','Xorazm'];
    const names   = ['Dilnoza','Malika','Gulnora','Nasiba','Zilola','Shahlo','Nodira','Feruza','Zulfiya','Munira','Sarvinoz','Kamola'];

    // 18 ta placeholder karta (rasmlar yuklanguncha)
    const placeholders = Array.from({length:18}, (_,i) => ({
      name: names[i % names.length],
      age:  18 + (i % 10),
      region: regions[i % regions.length],
      seed: i + 1
    }));

    document.getElementById('app').innerHTML = `
    <div class="splash-screen">
      <!-- 3 ustun chapdan o'ngga scroll -->
      <div class="splash-cols" id="splash-cols">
        <div class="splash-col scroll-up"   id="col0"></div>
        <div class="splash-col scroll-down" id="col1"></div>
        <div class="splash-col scroll-up"   id="col2"></div>
      </div>

      <!-- Orange gradient qatlam -->
      <div class="splash-overlay"></div>

      <!-- Markaziy kontent -->
      <div class="splash-content">
        <!-- Logo -->
        <div class="splash-logo-wrap">
          <div class="splash-logo">
            <img src="/img/logo.png" alt="UzChat Logo" style="width:100%;height:100%;object-fit:cover;border-radius:18px;position:relative">
          </div>
          <h1 class="splash-app-name">UzChat</h1>
          <p class="splash-tagline">O'zbekistonning №1 Video Chat</p>
        </div>

        <!-- Kirish tugmalari -->
        <div class="splash-buttons">
          <button class="splash-btn splash-btn-dark" data-go="/login" id="splash-google-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" style="flex-shrink:0"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span>Google orqali kirish</span>
          </button>

          <button class="splash-btn splash-btn-white" data-go="/register" id="splash-account-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="flex-shrink:0">
              <circle cx="12" cy="8" r="4" stroke="#333" stroke-width="2"/>
              <path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke="#333" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Hisob Yaratish</span>
          </button>
        </div>

        <!-- Shartlar -->
        <div class="splash-terms">
          <span class="splash-terms-check">✓</span>
          <span>Ilovadan foydalanish uchun
            <a href="#" class="splash-terms-link">Maxfiylik siyosati</a> va
            <a href="#" class="splash-terms-link">Foydalanish shartlari</a>ga rozilik bildirasiz
          </span>
        </div>
      </div>
    </div>`;

    // Unsplash dan yuqori sifatli portretlar (400x600, yuz bo'yicha crop)
    const PHOTOS = [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1521566652839-697aa473761a?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?w=400&h=600&fit=crop&crop=faces&q=85',
      'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=400&h=600&fit=crop&crop=faces&q=85',
    ];
    // 3 ustunni to'ldirish
    [0,1,2].forEach(col => {
      const el = document.getElementById('col'+col);
      if(!el) return;
      // 12 ta karta (sonsiz scroll uchun 2x)
      let html = '';
      for(let k=0;k<12;k++){
        const p = placeholders[(col*6+k)%placeholders.length];
        const imgUrl = PHOTOS[(col*6+k)%PHOTOS.length];
        html += `
        <div class="splash-photo-card">
          <div class="splash-photo-wrap">
            <img src="${imgUrl}" alt="" loading="lazy"
                 onerror="this.parentElement.style.background='linear-gradient(135deg,#4dd0e1,#1976d2)';this.style.display='none'">
            <div class="splash-photo-online"></div>
          </div>
        </div>`;
      }
      el.innerHTML = html;
    });
  },


  login(){

    document.getElementById('app').innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo"><h1><svg width="28" height="28" viewBox="0 0 54 54" fill="none" style="vertical-align:middle;margin-right:6px"><rect x="2" y="12" width="34" height="28" rx="8" fill="#00bcd4"/><path d="M36 18L52 10V44L36 36V18Z" fill="#4dd0e1" opacity="0.88"/></svg>UzChat</h1><p>Hisobingizga kiring</p></div>
        <div id="login-error" style="display:none;background:rgba(239,68,68,0.1);border:1px solid var(--error);border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.9rem;color:var(--error)"></div>
        <form id="login-form">
          <div class="form-group"><label>Username yoki Email</label><input class="form-control" id="l-username" placeholder="Username kiriting" required></div>
          <div class="form-group"><label>Parol</label><input class="form-control" type="password" id="l-password" placeholder="Parol kiriting" required></div>
          <button type="submit" class="btn btn-primary btn-block" style="margin-bottom:12px">Kirish</button>
        </form>
        <button class="btn btn-outline btn-block" id="forgot-btn" style="margin-bottom:16px">🔑 Parolni unutdim</button>
        <div class="auth-link">Hisob yo'qmi? <a data-go="/register">Ro'yxatdan o'tish</a></div>
      </div>
    </div>`;
    document.getElementById('login-form').onsubmit = Auth.login;
    document.getElementById('forgot-btn').onclick = Auth.forgotPassword;
  },

  register(){
    let step = 1;
    const render = () => {
      document.getElementById('app').innerHTML = `
      <div class="auth-page">
        <div class="auth-card">
          <div class="auth-logo"><h1><svg width="28" height="28" viewBox="0 0 54 54" fill="none" style="vertical-align:middle;margin-right:6px"><rect x="2" y="12" width="34" height="28" rx="8" fill="#00bcd4"/><path d="M36 18L52 10V44L36 36V18Z" fill="#4dd0e1" opacity="0.88"/></svg>UzChat</h1><p>Yangi hisob yaratish</p></div>
          <div class="step-indicator">
            <div class="step-dot ${step>=1?'active':''}"></div>
            <div class="step-dot ${step>=2?'active':''}"></div>
            <div class="step-dot ${step>=3?'active':''}"></div>
          </div>
          <div id="reg-error" style="display:none;background:rgba(239,68,68,0.1);border:1px solid var(--error);border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.9rem;color:var(--error)"></div>
          <form id="reg-form">
            ${step===1?`
            <h3 style="margin-bottom:16px;font-size:1rem;color:var(--text2)">1-qadam: Shaxsiy ma'lumotlar</h3>
            <div class="form-row">
              <div class="form-group"><label>Ism</label><input class="form-control" id="r-fname" placeholder="Ismingiz" required></div>
              <div class="form-group"><label>Familiya</label><input class="form-control" id="r-lname" placeholder="Familiyangiz" required></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Yosh</label><input class="form-control" type="number" id="r-age" min="16" max="80" placeholder="Yoshingiz" required></div>
              <div class="form-group"><label>Jins</label><select class="form-control" id="r-gender"><option value="male">Erkak</option><option value="female">Ayol</option></select></div>
            </div>
            <div class="form-group"><label>Viloyat</label><select class="form-control" id="r-region">${REGIONS.map(r=>`<option>${r}</option>`).join('')}</select></div>
            <button type="button" class="btn btn-primary btn-block" onclick="regNext(1)">Keyingisi →</button>
            `:''}
            ${step===2?`
            <h3 style="margin-bottom:16px;font-size:1rem;color:var(--text2)">2-qadam: Kirish ma'lumotlari</h3>
            <div class="form-group"><label>Username</label><input class="form-control" id="r-username" placeholder="Noyob username" required></div>
            <div class="form-group"><label>Email</label><input class="form-control" type="email" id="r-email" placeholder="Email manzilingiz" required></div>
            <div class="form-group"><label>Telefon raqam</label><input class="form-control" id="r-phone" placeholder="+998 90 123 45 67" required></div>
            <div style="display:flex;gap:8px">
              <button type="button" class="btn btn-outline" onclick="regNext(0)">← Orqaga</button>
              <button type="button" class="btn btn-primary" style="flex:1" onclick="regNext(2)">Keyingisi →</button>
            </div>
            `:''}
            ${step===3?`
            <h3 style="margin-bottom:16px;font-size:1rem;color:var(--text2)">3-qadam: Parol va referal</h3>
            <div class="form-group"><label>Parol</label><input class="form-control" type="password" id="r-pass" placeholder="Kamida 6 ta belgi" required></div>
            <div class="form-group"><label>Parolni tasdiqlang</label><input class="form-control" type="password" id="r-pass2" placeholder="Parolni qaytaring" required></div>
            <div class="form-group"><label>Referal kod (ixtiyoriy)</label><input class="form-control" id="r-ref" placeholder="Do'stingiz referal kodi"></div>
            <div style="background:rgba(16,185,129,0.1);border:1px solid var(--success);border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.85rem;color:var(--success)">🎁 Ro'yxatdan o'tganda 200 coin sovg'a!</div>
            <div style="display:flex;gap:8px">
              <button type="button" class="btn btn-outline" onclick="regNext(-1)">← Orqaga</button>
              <button type="submit" class="btn btn-primary" style="flex:1">✅ Ro'yxatdan o'tish</button>
            </div>
            `:''}
          </form>
          <div class="auth-link" style="margin-top:16px">Hisob bormi? <a data-go="/login">Kirish</a></div>
        </div>
      </div>`;
      window.regNext = (dir) => {
        if(dir===1){ if(!Auth.validateStep1()) return; step=2; }
        else if(dir===2){ if(!Auth.validateStep2()) return; step=3; }
        else if(dir===0){ step=1; }
        else if(dir===-1){ step=2; }
        render();
      };
      if(step===3){ document.getElementById('reg-form').onsubmit = Auth.register; }
      Auth.restoreRegData();
    };
    render();
  },

  dashboard(){
    const user = DB.getCurrentUser();
    const allUsers = DB.getUsers().filter(u=>!u.isBlocked);
    const content = `
    <div class="page-header"><h2>👥 Foydalanuvchilar</h2><p>Online foydalanuvchilar bilan video suhbat boshlang</p></div>
    <div class="filters-bar">
      <div class="filter-group"><label>Viloyat</label><select class="filter-select" id="f-region"><option value="">Barchasi</option>${REGIONS.map(r=>`<option>${r}</option>`).join('')}</select></div>
      <div class="filter-group"><label>Jins</label><select class="filter-select" id="f-gender"><option value="">Barchasi</option><option value="male">Erkak</option><option value="female">Ayol</option></select></div>
      <div class="filter-group"><label>Yosh</label><select class="filter-select" id="f-age"><option value="">Barchasi</option><option value="16-20">16-20</option><option value="21-25">21-25</option><option value="26-30">26-30</option><option value="31-99">31+</option></select></div>
      <div class="filter-group"><label>Daraja</label><select class="filter-select" id="f-level"><option value="">Barchasi</option><option>Silver</option><option>Gold</option><option>Platinum</option></select></div>
      <button class="btn btn-primary btn-sm" onclick="applyFilters()">🔍 Filter</button>
      <button class="btn btn-outline btn-sm" onclick="clearFilters()">✕ Tozalash</button>
    </div>
    <div id="users-grid" class="users-grid">
      ${allUsers.map(u=>T.userCard(u,user.id)).join('')}
    </div>`;
    document.getElementById('app').innerHTML = T.layout(user, content);
    document.getElementById('logout-btn')?.addEventListener('click', Auth.logout);
    document.getElementById('sb-logout')?.addEventListener('click', Auth.logout);
    window.applyFilters = Handlers.applyFilters;
    window.clearFilters = Handlers.clearFilters;
    window.startCall = (id) => Router.go('/video', {targetId: id});
  },

  profile(){
    const user = DB.getCurrentUser();
    const txs = DB.getTransactions().filter(t=>t.userId===user.id).slice(0,10);
    const lvl = getLevelColor(user.level);
    const nextLevel = user.level==='Silver'?50000:user.level==='Gold'?200000:null;
    const progress = nextLevel ? Math.min((user.totalCoinsBought/nextLevel)*100,100) : 100;
    const content = `
    <div class="page-header"><h2>👤 Mening Profilim</h2></div>
    <div class="profile-header">
      <div class="profile-avatar-lg">${avatarEmoji(user.gender)}</div>
      <div class="profile-info">
        <h2>${user.firstName} ${user.lastName}</h2>
        <p style="color:var(--text2);margin-bottom:8px">@${user.username} · ${user.age} yosh · ${user.region}</p>
        <span class="user-level-badge ${lvl}">${getLevelIcon(user.level)} ${user.level}</span>
        ${nextLevel?`<div style="margin-top:12px"><div style="font-size:0.8rem;color:var(--text2);margin-bottom:6px">Keyingi daraja: ${fmtCoins(nextLevel-user.totalCoinsBought)} coin qoldi</div><div style="height:6px;background:var(--bg);border-radius:3px"><div style="height:100%;width:${progress}%;background:linear-gradient(135deg,var(--primary),var(--accent));border-radius:3px"></div></div></div>`:'<div style="margin-top:8px;color:var(--platinum)">💎 Maksimal daraja!</div>'}
      </div>
    </div>
    <div class="profile-stats">
      <div class="profile-stat"><div class="profile-stat-value">💰 ${fmtCoins(user.coins)}</div><div class="profile-stat-label">Joriy Coin</div></div>
      <div class="profile-stat"><div class="profile-stat-value">${fmtCoins(user.totalCoinsBought)}</div><div class="profile-stat-label">Jami Sotib Olingan</div></div>
      <div class="profile-stat"><div class="profile-stat-value">${getLevelIcon(user.level)} ${user.level}</div><div class="profile-stat-label">Daraja</div></div>
    </div>
    <div class="referral-box">
      <h3 style="margin-bottom:12px">🔗 Referal Tizim</h3>
      <p style="color:var(--text2);font-size:0.9rem;margin-bottom:12px">Do'stlaringizni taklif qiling. Ular coin sotib olganda <b style="color:var(--gold)">10% bonus</b> olasiz!</p>
      <div class="referral-code" onclick="copyRef('${user.referralCode}')" title="Nusxalash uchun bosing">
        ${user.referralCode} 📋
      </div>
    </div>
    <div class="withdraw-box">
      <div class="withdraw-header">
        <div>
          <h3>💸 Pul Chiqarish</h3>
          <p style="color:var(--text2);font-size:0.85rem;margin-top:4px">Yig'ilgan coinlarni pulga aylantiring</p>
        </div>
        <div class="withdraw-balance">
          <span class="withdraw-coin-val">💰 ${fmtCoins(user.coins)}</span>
          <span class="withdraw-som-val">≈ ${fmtCoins(user.coins * COIN_SELL_RATE)} so'm</span>
        </div>
      </div>
      <div class="withdraw-info-grid">
        <div class="withdraw-info-item">
          <span class="withdraw-info-label">Kurs</span>
          <span class="withdraw-info-value">1 coin = ${COIN_SELL_RATE} so'm</span>
        </div>
        <div class="withdraw-info-item">
          <span class="withdraw-info-label">Minimum</span>
          <span class="withdraw-info-value">${fmtCoins(MIN_WITHDRAWAL_COINS)} coin</span>
        </div>
      </div>
      ${user.coins >= MIN_WITHDRAWAL_COINS ?
        `<button class="btn btn-primary btn-block" onclick="openWithdrawModal()">💸 Pul chiqarishni so'rash</button>` :
        `<div style="text-align:center;padding:12px;background:rgba(239,68,68,0.08);border-radius:10px;color:var(--error);font-size:0.85rem">⚠️ Kamida ${fmtCoins(MIN_WITHDRAWAL_COINS)} coin kerak (${fmtCoins(MIN_WITHDRAWAL_COINS - user.coins)} coin yetishmayapti)</div>`}
    </div>
    <div class="card">
      <h3 style="margin-bottom:16px">📋 So'nggi tranzaksiyalar</h3>
      ${txs.length?`<div class="table-wrap"><table><thead><tr><th>Tur</th><th>Miqdor</th><th>Izoh</th><th>Sana</th></tr></thead><tbody>
      ${txs.map(t=>`<tr><td>${t.type==='credit'?'➕':'➖'}</td><td style="color:${t.type==='credit'?'var(--success)':'var(--error)'};font-weight:700">${t.type==='credit'?'+':'−'}${fmtCoins(t.amount)}</td><td>${t.desc}</td><td style="color:var(--text2);font-size:0.8rem">${timeSince(t.createdAt)}</td></tr>`).join('')}
      </tbody></table></div>`:'<div class="empty-state"><div class="empty-state-icon">📭</div><p>Tranzaksiyalar yo\'q</p></div>'}
    </div>
    <button class="logout-btn-profile" id="profile-logout-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Chiqib ketish
    </button>`;
    document.getElementById('app').innerHTML = T.layout(user, content);
    document.getElementById('profile-logout-btn')?.addEventListener('click', Auth.logout);
    window.copyRef = (code) => { navigator.clipboard.writeText(code); toast('Referal kod nusxalandi! ✅'); };
    window.openWithdrawModal = () => {
      const u = DB.getCurrentUser();
      openModal(`
        <div class="modal-header"><h3>💸 Pul Chiqarish</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
        <div style="padding:8px">
          <div style="text-align:center;margin-bottom:20px">
            <div style="font-size:2.5rem;margin-bottom:8px">💰</div>
            <div style="font-size:1.4rem;font-weight:800;color:var(--gold)">${fmtCoins(u.coins)} coin</div>
            <div style="font-size:0.85rem;color:var(--text2)">≈ ${fmtCoins(u.coins * COIN_SELL_RATE)} so'm</div>
          </div>
          <div class="form-group">
            <label>Necha coin chiqarmoqchisiz?</label>
            <input class="form-control" type="number" id="withdraw-amount" min="${MIN_WITHDRAWAL_COINS}" max="${u.coins}" placeholder="Kamida ${fmtCoins(MIN_WITHDRAWAL_COINS)}" oninput="updateWithdrawCalc()">
            <div id="withdraw-calc" style="font-size:0.85rem;color:var(--gold);margin-top:6px"></div>
          </div>
          <div class="form-group">
            <label>Karta raqamingiz (Uzcard/Humo)</label>
            <input class="form-control" id="withdraw-card" placeholder="8600 •••• •••• ••••">
          </div>
          <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:12px;margin-bottom:16px;font-size:0.8rem;color:var(--gold)">
            ℹ️ Pul 24 soat ichida kartangizga o'tkaziladi. Minimum: ${fmtCoins(MIN_WITHDRAWAL_COINS)} coin.
          </div>
          <button class="btn btn-primary btn-block" onclick="Handlers.requestWithdrawal()">✅ Chiqarish so'rovini yuborish</button>
        </div>
      `);
      window.updateWithdrawCalc = () => {
        const v = parseInt(document.getElementById('withdraw-amount').value) || 0;
        document.getElementById('withdraw-calc').textContent = v > 0 ? `= ${fmtCoins(v * COIN_SELL_RATE)} so'm` : '';
      };
    };
  },

  shop(){
    const user = DB.getCurrentUser();
    const content = `
    <div class="page-header"><h2>🛒 Coin Shop</h2><p>Joriy balans: <b style="color:var(--gold)">💰 ${fmtCoins(user.coins)}</b></p></div>
    <div class="shop-grid">
      ${COIN_PACKAGES.map(p=>`
      <div class="shop-card ${p.popular?'popular':''}">
        <div class="shop-coins-icon">💎</div>
        <div class="shop-coins-count">${fmtCoins(p.coins)}</div>
        <div class="shop-package-name">${p.label} paketi</div>
        <div class="shop-price">${fmtPrice(p.price)}</div>
        <button class="btn btn-primary btn-block" onclick="openBuyModal(${p.id})">Sotib olish</button>
      </div>`).join('')}
    </div>
    <div class="card" style="margin-top:28px">
      <h3 style="margin-bottom:8px">ℹ️ Coin haqida</h3>
      <ul style="color:var(--text2);font-size:0.9rem;line-height:2;padding-left:20px">
        <li>1 daqiqa video suhbat = 50 coin</li>
        <li>Referal orqali sotilgan coindan 10% bonus</li>
        <li>Silver: 0–50,000 coin · Gold: 50,001–200,000 · Platinum: 200,001+</li>
      </ul>
    </div>`;
    document.getElementById('app').innerHTML = T.layout(user, content);
    document.getElementById('logout-btn')?.addEventListener('click', Auth.logout);
    document.getElementById('sb-logout')?.addEventListener('click', Auth.logout);
    window.openBuyModal = (id) => {
      const pkg = COIN_PACKAGES.find(p=>p.id===id);
      openModal(T.buyModal(pkg));
    };
    window.confirmBuy = Handlers.confirmBuy;
  },

  video(){
    const user = DB.getCurrentUser();
    const {targetId, isCallee} = Router.getState();
    const target = targetId ? DB.getUserById(targetId) : null;
    if(!target){ Router.go('/dashboard'); return; }

    document.getElementById('app').innerHTML = `
    <div class="imo-video-page">
      <!-- To'liq ekran remote video -->
      <div class="imo-remote-container">
        <video id="remote-video" autoplay playsinline></video>
        <div id="remote-placeholder" class="imo-placeholder">
          <div class="imo-placeholder-avatar">${avatarEmoji(target.gender)}</div>
          <p class="imo-placeholder-name">${target.firstName} ${target.lastName}</p>
          <p class="imo-placeholder-status">Ulanilmoqda...</p>
          <div class="imo-calling-anim"><span></span><span></span><span></span></div>
        </div>
      </div>

      <!-- O'ng tepa burchakda kichik local video (PIP) -->
      <div class="imo-pip" id="imo-pip">
        <video id="local-video" autoplay playsinline muted></video>
        <div id="local-placeholder" class="imo-pip-placeholder">
          <div style="font-size:1.5rem">${avatarEmoji(user.gender)}</div>
        </div>
      </div>

      <!-- Tepa qism: ism va vaqt -->
      <div class="imo-top-bar">
        <div class="imo-top-left">
          <button class="imo-back-btn" onclick="endVideoCall()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="imo-caller-info">
            <span class="imo-caller-name">${target.firstName} ${target.lastName}</span>
            <span class="imo-call-status" id="call-status">Chaqirilmoqda...</span>
          </div>
        </div>
        <div class="imo-top-right">
          <div class="imo-timer-badge" id="call-timer">00:00</div>
          <div class="imo-coin-badge" id="coin-display">💰 ${fmtCoins(user.coins)}</div>
        </div>
      </div>

      <!-- Pastki kontrol tugmalari -->
      <div class="imo-bottom-bar">
        <button class="imo-ctrl-btn" id="mic-btn" title="Mikrofon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" fill="#fff"/><path d="M19 10v2a7 7 0 01-14 0v-2" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="19" x2="12" y2="23" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <button class="imo-ctrl-btn" id="cam-btn" title="Kamera">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="15" height="14" rx="3" fill="#fff"/><path d="M17 9.5l5-3v11l-5-3v-5z" fill="#fff" opacity="0.8"/></svg>
        </button>
        <button class="imo-ctrl-btn imo-gift-btn" onclick="openGiftModal('${target.id}')" title="Sovg'a">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="8" width="18" height="13" rx="2" stroke="#FCD34D" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="21" stroke="#FCD34D" stroke-width="2"/><path d="M12 8C12 8 12 5 9 3c-1.5-1-4 0-3 2s3 3 6 3" stroke="#FCD34D" stroke-width="2" stroke-linecap="round"/><path d="M12 8C12 8 12 5 15 3c1.5-1 4 0 3 2s-3 3-6 3" stroke="#FCD34D" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <button class="imo-ctrl-btn imo-end-btn" onclick="endVideoCall()" title="Tugatish">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M23 16.92C23 16.92 19.28 20 12 20S1 16.92 1 16.92l3.45-3.45c.58-.58 1.52-.58 2.1 0l1.77 1.77c.29.29.77.29 1.06 0l5.24-5.24c.29-.29.77-.29 1.06 0l1.77 1.77c.58.58.58 1.52 0 2.1L23 16.92z" fill="#fff"/></svg>
        </button>
      </div>

      <!-- Coin info -->
      <div class="imo-coin-info">50 coin/daqiqa</div>
    </div>`;

    // PIP drag funksiyasi
    const pip = document.getElementById('imo-pip');
    let isDragging = false, startX, startY, origLeft, origTop;
    pip.addEventListener('mousedown', dragStart);
    pip.addEventListener('touchstart', dragStart, {passive:false});
    function dragStart(e){
      isDragging = true;
      const t = e.touches ? e.touches[0] : e;
      startX = t.clientX; startY = t.clientY;
      const rect = pip.getBoundingClientRect();
      const parent = pip.parentElement.getBoundingClientRect();
      origLeft = rect.left - parent.left; origTop = rect.top - parent.top;
      pip.style.transition = 'none';
      document.addEventListener('mousemove', dragMove);
      document.addEventListener('mouseup', dragEnd);
      document.addEventListener('touchmove', dragMove, {passive:false});
      document.addEventListener('touchend', dragEnd);
    }
    function dragMove(e){
      if(!isDragging) return;
      e.preventDefault();
      const t = e.touches ? e.touches[0] : e;
      const dx = t.clientX - startX, dy = t.clientY - startY;
      pip.style.left = (origLeft + dx) + 'px';
      pip.style.top = (origTop + dy) + 'px';
      pip.style.right = 'auto';
    }
    function dragEnd(){
      isDragging = false;
      pip.style.transition = 'box-shadow 0.3s ease';
      document.removeEventListener('mousemove', dragMove);
      document.removeEventListener('mouseup', dragEnd);
      document.removeEventListener('touchmove', dragMove);
      document.removeEventListener('touchend', dragEnd);
    }

    window.openGiftModal = (id) => { openModal(T.giftModal()); window._callTargetId = id; };
    window.sendGift = Handlers.sendGift;

    // Hide placeholder when video starts
    document.getElementById('local-video').onloadedmetadata = () => {
      const ph = document.getElementById('local-placeholder');
      if(ph) ph.style.display='none';
    };
    document.getElementById('remote-video').onloadedmetadata = () => {
      const ph = document.getElementById('remote-placeholder');
      if(ph) ph.style.display='none';
      const status = document.getElementById('call-status');
      if(status) status.textContent = 'Ulangan';
    };

    // Mic/Cam toggle
    let muted=false, camOff=false;
    document.getElementById('mic-btn').onclick=()=>{
      muted=!muted;
      if(localStream) localStream.getAudioTracks().forEach(t=>t.enabled=!muted);
      document.getElementById('mic-btn').style.opacity=muted?'0.4':'1';
    };
    document.getElementById('cam-btn').onclick=()=>{
      camOff=!camOff;
      if(localStream) localStream.getVideoTracks().forEach(t=>t.enabled=!camOff);
      document.getElementById('cam-btn').style.opacity=camOff?'0.4':'1';
    };
  },

  admin(){
    const user = DB.getCurrentUser();
    const users = DB.getUsers();
    const txs = DB.getTransactions();
    const totalCoins = txs.filter(t=>t.type==='credit'&&t.desc.includes('Sotib')).reduce((s,t)=>s+t.amount,0);
    const content = `
    <div class="page-header"><h2>⚙️ Admin Panel</h2><p>UzChat boshqaruv markazi</p></div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-icon">👥</div><div class="stat-card-value">${users.length}</div><div class="stat-card-label">Jami Foydalanuvchilar</div></div>
      <div class="stat-card"><div class="stat-card-icon">🟢</div><div class="stat-card-value">${users.filter(u=>u.isOnline).length}</div><div class="stat-card-label">Online</div></div>
      <div class="stat-card"><div class="stat-card-icon">🚫</div><div class="stat-card-value">${users.filter(u=>u.isBlocked).length}</div><div class="stat-card-label">Bloklangan</div></div>
      <div class="stat-card"><div class="stat-card-icon">💰</div><div class="stat-card-value">${fmtCoins(totalCoins)}</div><div class="stat-card-label">Jami Sotilgan Coin</div></div>
    </div>
    <div class="admin-users-list">
      ${users.map((u,i)=>`<div class="admin-user-item ${u.isBlocked?'blocked':''}">
        <div class="admin-user-left">
          <div class="admin-user-avatar">${avatarEmoji(u.gender)}</div>
          <div class="admin-user-info">
            <div class="admin-user-name">${u.firstName} ${u.lastName}</div>
            <div class="admin-user-meta">@${u.username} · ${u.region}</div>
            <div style="margin-top:4px"><span class="user-level-badge ${getLevelColor(u.level)}" style="font-size:0.65rem;padding:2px 6px">${getLevelIcon(u.level)} ${u.level}</span> <span style="color:var(--gold);font-weight:700;font-size:0.8rem">💰 ${fmtCoins(u.coins)}</span></div>
          </div>
        </div>
        <button class="btn btn-sm ${u.isBlocked?'btn-primary':'btn-danger'}" onclick="toggleBlock('${u.id}')" style="flex-shrink:0">${u.isBlocked?'Ochish':'Ban'}</button>
      </div>`).join('')}
    </div>`;
    document.getElementById('app').innerHTML = T.layout(user, content);
    document.getElementById('logout-btn')?.addEventListener('click', Auth.logout);
    document.getElementById('sb-logout')?.addEventListener('click', Auth.logout);
    window.toggleBlock = Handlers.toggleBlock;
  }
};
