const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!token) {
  window.location.href = 'login.html';
}

const userInfo = document.getElementById('userInfo');
const logoutBtn = document.getElementById('logoutBtn');

if (userInfo && user) {
  userInfo.textContent = `Sesión activa: ${user.nombre || user.usuario || user.email || 'Usuario'}`;
}

logoutBtn?.addEventListener('click', async () => {
  try {
    await fetch(`${API_AUTH}/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (e) {}

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});