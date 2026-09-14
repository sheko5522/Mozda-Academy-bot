// ===== AUTH =====
let _regData = {};
const Auth = {
  login(e){
    e && e.preventDefault();
    const un = document.getElementById('l-username').value.trim().toLowerCase();
    const pw = document.getElementById('l-password').value;
    const err = document.getElementById('login-error');
    const user = DB.getUserByUsername(un) || DB.getUserByEmail(un);
    if(!user || user.password !== hashPass(pw)){
      err.style.display='block'; err.textContent='Username/Email yoki parol noto\'g\'ri!'; return;
    }
    if(user.isBlocked){ err.style.display='block'; err.textContent='Hisobingiz bloklangan!'; return; }
    DB.updateUser(user.id,{isOnline:true});
    DB.setCurrentUser(user.id);
    initSocket(user.id);
    toast('Xush kelibsiz, '+user.firstName+'! 👋');
    Router.go('/dashboard');
  },
  register(e){
    e && e.preventDefault();
    const pass = document.getElementById('r-pass').value;
    const pass2 = document.getElementById('r-pass2').value;
    const err = document.getElementById('reg-error');
    if(pass !== pass2){ err.style.display='block'; err.textContent='Parollar mos emas!'; return; }
    if(pass.length < 6){ err.style.display='block'; err.textContent='Parol kamida 6 ta belgi!'; return; }
    if(DB.getUserByUsername(_regData.username)){ err.style.display='block'; err.textContent='Bu username band!'; return; }
    if(DB.getUserByEmail(_regData.email)){ err.style.display='block'; err.textContent='Bu email allaqachon ro\'yxatdan o\'tgan!'; return; }
    const refCode = document.getElementById('r-ref').value.trim().toUpperCase();
    const referrer = refCode ? DB.getUserByReferral(refCode) : null;
    const newUser = {
      id: genId(),
      firstName: _regData.firstName, lastName: _regData.lastName,
      username: _regData.username, password: hashPass(pass),
      email: _regData.email, phone: _regData.phone,
      age: parseInt(_regData.age), gender: _regData.gender, region: _regData.region,
      coins: REGISTRATION_BONUS, totalCoinsBought: 0, level: 'Silver',
      referralCode: genReferral(_regData.firstName),
      referredBy: referrer ? referrer.id : null,
      isOnline: true, isBlocked: false, isAdmin: false,
      createdAt: new Date().toISOString()
    };
    DB.addUser(newUser);
    DB.addTransaction({id:genId(),userId:newUser.id,type:'credit',amount:REGISTRATION_BONUS,desc:'Ro\'yxatdan o\'tish bonusi',createdAt:new Date().toISOString()});
    DB.setCurrentUser(newUser.id);
    _regData = {};
    toast('Ro\'yxatdan muvaffaqiyatli o\'tdingiz! 🎉');
    Router.go('/dashboard');
  },
  validateStep1(){
    const fn=document.getElementById('r-fname').value.trim();
    const ln=document.getElementById('r-lname').value.trim();
    const age=document.getElementById('r-age').value;
    const err=document.getElementById('reg-error');
    if(!fn||!ln){ err.style.display='block'; err.textContent='Ism va familiya to\'ldiring!'; return false; }
    if(!age||age<16||age>80){ err.style.display='block'; err.textContent='Yosh 16-80 oralig\'ida bo\'lishi kerak!'; return false; }
    _regData.firstName=fn; _regData.lastName=ln; _regData.age=age;
    _regData.gender=document.getElementById('r-gender').value;
    _regData.region=document.getElementById('r-region').value;
    return true;
  },
  validateStep2(){
    const un=document.getElementById('r-username').value.trim();
    const em=document.getElementById('r-email').value.trim();
    const ph=document.getElementById('r-phone').value.trim();
    const err=document.getElementById('reg-error');
    if(!un||un.length<3){ err.style.display='block'; err.textContent='Username kamida 3 ta belgi!'; return false; }
    if(!/^[a-z0-9_]+$/i.test(un)){ err.style.display='block'; err.textContent='Username faqat harf va raqamlardan iborat!'; return false; }
    if(!em||!em.includes('@')){ err.style.display='block'; err.textContent='Email to\'g\'ri kiriting!'; return false; }
    if(!ph){ err.style.display='block'; err.textContent='Telefon raqam kiriting!'; return false; }
    _regData.username=un; _regData.email=em; _regData.phone=ph;
    return true;
  },
  restoreRegData(){
    if(_regData.firstName && document.getElementById('r-fname')) document.getElementById('r-fname').value=_regData.firstName;
    if(_regData.lastName && document.getElementById('r-lname')) document.getElementById('r-lname').value=_regData.lastName;
    if(_regData.age && document.getElementById('r-age')) document.getElementById('r-age').value=_regData.age;
    if(_regData.username && document.getElementById('r-username')) document.getElementById('r-username').value=_regData.username;
    if(_regData.email && document.getElementById('r-email')) document.getElementById('r-email').value=_regData.email;
    if(_regData.phone && document.getElementById('r-phone')) document.getElementById('r-phone').value=_regData.phone;
  },
  forgotPassword(){
    openModal(`
    <div class="modal-header"><h3>🔑 Parolni tiklash</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div style="padding:8px">
      <div class="form-group"><label>Email manzilingiz</label><input class="form-control" id="fp-email" placeholder="Email kiriting"></div>
      <div id="fp-msg" style="display:none;margin-bottom:12px;padding:10px;border-radius:8px;font-size:0.9rem"></div>
      <button class="btn btn-primary btn-block" onclick="doForgot()">Tiklash so'rovi yuborish</button>
    </div>`);
    window.doForgot = () => {
      const em = document.getElementById('fp-email').value.trim();
      const msg = document.getElementById('fp-msg');
      const u = DB.getUserByEmail(em);
      msg.style.display='block';
      if(u){ msg.style.background='rgba(16,185,129,0.1)'; msg.style.color='var(--success)'; msg.textContent='✅ Parol tiklash havolasi yuborildi! (Demo: parol = 1234)'; }
      else { msg.style.background='rgba(239,68,68,0.1)'; msg.style.color='var(--error)'; msg.textContent='❌ Bu email topilmadi!'; }
    };
  },
  logout(){
    const u=DB.getCurrentUser();
    if(u) DB.updateUser(u.id,{isOnline:false});
    DB.logout();
    toast('Chiqildi! Xayr 👋','info');
    Router.go('/');
  }
};
