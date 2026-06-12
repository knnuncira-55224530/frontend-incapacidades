const form = document.getElementById('loginForm');
const message = document.getElementById('loginMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    usuario: document.getElementById('usuario').value.trim(),
    contrasena: document.getElementById('password').value
  };

  try {
    const response = await fetch(`${API_AUTH}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      window.location.href = 'dashboard.html';
    } else {
      message.textContent = data.message || 'Error de login';
    }
  } catch (error) {
    message.textContent = 'Error conectando con el servidor';
  }
});