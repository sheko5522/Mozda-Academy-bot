// ===== CONSTANTS =====
const REGIONS = ["Toshkent","Samarqand","Buxoro","Farg'ona","Andijon","Namangan","Qashqadaryo","Surxondaryo","Jizzax","Sirdaryo","Navoiy","Xorazm","Qoraqalpog'iston"];
const COIN_PER_MINUTE = 50;
const REGISTRATION_BONUS = 200;
const REFERRAL_BONUS_PERCENT = 10;

const COIN_PACKAGES = [
  {id:1,coins:1000,price:100000,label:"Starter",popular:false},
  {id:2,coins:5000,price:450000,label:"Standard",popular:true},
  {id:3,coins:15000,price:1200000,label:"Premium",popular:false},
  {id:4,coins:50000,price:3500000,label:"VIP",popular:false},
  {id:5,coins:100000,price:6000000,label:"Diamond",popular:false}
];

// Pul yechib olish sozlamalari
const COIN_SELL_RATE = 33; // 1 coin = 33 so'm (sotib olish narxining 1/3)
const MIN_WITHDRAWAL_COINS = 5000;

const GIFTS = [
  {id:1,name:"Atirgul",emoji:"🌹",coins:100,color:"#FFD700",glow:"rgba(255,215,0,0.5)",tier:1},
  {id:2,name:"Yurak",emoji:"💖",coins:500,color:"#ff1493",glow:"rgba(255,20,147,0.5)",tier:2},
  {id:3,name:"Yulduz",emoji:"⭐",coins:1000,color:"#FFD700",glow:"rgba(255,215,0,0.5)",tier:2},
  {id:4,name:"Olmos",emoji:"💎",coins:2500,color:"#00BFFF",glow:"rgba(0,191,255,0.5)",tier:3},
  {id:5,name:"Toj",emoji:"👑",coins:5000,color:"#FFD700",glow:"rgba(255,215,0,0.6)",tier:4},
  {id:6,name:"Samolyot",emoji:"✈️",coins:10000,color:"#00BFFF",glow:"rgba(0,191,255,0.5)",tier:5}
];

const LEVEL_RULES = {
  Silver:{min:0,max:50000,icon:"🥈",color:"silver"},
  Gold:{min:50001,max:200000,icon:"🥇",color:"gold"},
  Platinum:{min:200001,max:Infinity,icon:"💎",color:"platinum"}
};

const DEMO_USERS = [
  {id:"admin",firstName:"Admin",lastName:"UzChat",username:"admin",password:"12345",email:"admin@uzchat.uz",phone:"+998900000000",age:30,gender:"male",region:"Toshkent",coins:99999,totalCoinsBought:999999,level:"Platinum",referralCode:"ADMIN000",referredBy:null,isOnline:true,isBlocked:false,isAdmin:true,createdAt:new Date().toISOString()}
];

// ===== DATABASE =====
const DB = {
  getUsers(){return JSON.parse(localStorage.getItem('uzc_users')||'[]')},
  saveUsers(u){localStorage.setItem('uzc_users',JSON.stringify(u))},
  getUserById(id){return this.getUsers().find(u=>u.id===id)||null},
  getUserByUsername(un){return this.getUsers().find(u=>u.username===un)||null},
  getUserByEmail(em){return this.getUsers().find(u=>u.email===em)||null},
  getUserByReferral(code){return this.getUsers().find(u=>u.referralCode===code)||null},
  updateUser(id,data){
    const users=this.getUsers();
    const i=users.findIndex(u=>u.id===id);
    if(i!==-1){users[i]={...users[i],...data};this.saveUsers(users);return users[i];}
    return null;
  },
  addUser(u){const users=this.getUsers();users.push(u);this.saveUsers(users);return u;},
  getCurrentUser(){
    const id=localStorage.getItem('uzc_current');
    return id?this.getUserById(id):null;
  },
  setCurrentUser(id){localStorage.setItem('uzc_current',id)},
  logout(){localStorage.removeItem('uzc_current')},
  getTransactions(){return JSON.parse(localStorage.getItem('uzc_tx')||'[]')},
  addTransaction(tx){
    const txs=this.getTransactions();
    txs.unshift(tx);
    if(txs.length>200)txs.splice(200);
    localStorage.setItem('uzc_tx',JSON.stringify(txs));
  },
  init(){
    if(!this.getUsers().length){
      this.saveUsers(DEMO_USERS);
    }
  }
};
