document.addEventListener('DOMContentLoaded', () => {
  // Eski ma'lumotlarni tozalash va faqat admin qoldirish
  localStorage.removeItem('uzc_users');
  localStorage.removeItem('uzc_tx');
  localStorage.removeItem('uzc_current');
  DB.init();

  // Parollarni hash qilish
  const users = DB.getUsers();
  let needsSave = false;
  users.forEach(u => {
    if(u.password === '12345' || u.password === '1234' || u.password === 'admin123'){
      u.password = hashPass(u.password);
      needsSave = true;
    }
  });
  if(needsSave) DB.saveUsers(users);

  // Init socket if user already logged in
  const currentUser = DB.getCurrentUser();
  if(currentUser) initSocket(currentUser.id);

  Router.init();
});
