const token = localStorage.getItem('token');
const userInfo = document.getElementById('userInfo');
const logoutBtn = document.getElementById('logoutBtn');

if (!token) {
  window.location.href = 'login.html';
}

const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
userInfo.textContent = `Bienvenido ${usuario.nombre || ''} - Rol: ${usuario.rol || ''}`;

logoutBtn.addEventListener('click', async () => {
  try {
    await fetch(`${API_AUTH}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
  } catch (error) {}

  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
});