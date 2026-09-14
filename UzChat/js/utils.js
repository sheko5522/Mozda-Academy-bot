// ===== UTILITIES =====
function genId(){return Date.now().toString(36)+Math.random().toString(36).slice(2);}
function genReferral(name){return (name.slice(0,4).toUpperCase()+Math.random().toString(36).slice(2,6).toUpperCase());}
function getLevel(total){
  if(total>=200001)return'Platinum';
  if(total>=50001)return'Gold';
  return'Silver';
}
function getLevelIcon(lvl){return {Silver:'🥈',Gold:'🥇',Platinum:'💎'}[lvl]||'🥈';}
function getLevelColor(lvl){return {Silver:'level-silver',Gold:'level-gold',Platinum:'level-platinum'}[lvl]||'level-silver';}
function fmtCoins(n){return Number(n).toLocaleString();}
function fmtPrice(n){return Number(n).toLocaleString()+' so\'m';}
function fmtTime(sec){const m=Math.floor(sec/60),s=sec%60;return`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
function hashPass(p){let h=0;for(let i=0;i<p.length;i++){h=((h<<5)-h)+p.charCodeAt(i);h=h&h;}return h.toString();}
function avatarEmoji(gender){return gender==='female'?'👩':'👨';}
function timeSince(iso){
  const sec=Math.floor((Date.now()-new Date(iso))/1000);
  if(sec<60)return sec+'s oldin';
  if(sec<3600)return Math.floor(sec/60)+'daq oldin';
  if(sec<86400)return Math.floor(sec/3600)+'soat oldin';
  return Math.floor(sec/86400)+'kun oldin';
}

// ===== TOAST =====
function toast(msg,type='success'){
  const c=document.getElementById('toast-container');
  const t=document.createElement('div');
  const icons={success:'✅',error:'❌',info:'ℹ️',warning:'⚠️'};
  t.className=`toast toast-${type}`;
  t.innerHTML=`<span>${icons[type]||''}</span> ${msg}`;
  c.appendChild(t);
  setTimeout(()=>t.classList.add('show'),10);
  setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),400);},3200);
}

// ===== COPY CARD =====
window.copyCard = function(){
  const cardNum = '8600123456789012';
  navigator.clipboard.writeText(cardNum).then(()=>{
    toast('Karta raqam nusxalandi! ✅');
  }).catch(()=>{
    // fallback
    const ta = document.createElement('textarea');
    ta.value = cardNum; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    toast('Karta raqam nusxalandi! ✅');
  });
};

// ===== MODAL =====
function openModal(html){
  document.getElementById('modal-content').innerHTML=html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal(){
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-content').innerHTML='';
}
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('modal-overlay').addEventListener('click',function(e){
    if(e.target===this)closeModal();
  });
});

// ===== ROUTER =====
const Router = {
  go(path,params={}){
    window.history.pushState({params},'',path);
    this._state=params;
    this.render(path);
  },
  getState(){return window.history.state?.params||this._state||{}},
  _state:{},
  render(path){
    const u=DB.getCurrentUser();
    const auth=['/dashboard','/profile','/video','/shop','/admin'];
    const guest=['/','/login','/register'];
    if(auth.includes(path)&&!u){this.go('/login');return;}
    if(path==='/admin'&&u&&!u.isAdmin){this.go('/dashboard');return;}
    if(guest.includes(path)&&u){this.go('/dashboard');return;}
    const page=path.replace('/','').replace('-','_')||'home';
    const fn=Pages[page]||Pages.home;
    fn();
  },
  init(){
    window.addEventListener('popstate',()=>this.render(window.location.pathname));
    document.addEventListener('click',e=>{
      const el=e.target.closest('[data-go]');
      if(el){e.preventDefault();this.go(el.dataset.go,el.dataset.params?JSON.parse(el.dataset.params):{});}
    });
    this.render(window.location.pathname);
  }
};
