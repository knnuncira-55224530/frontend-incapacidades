const form = document.getElementById('loginForm');
const message = document.getElementById('message');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = document.getElementById('user').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${API_AUTH}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('usuario', JSON.stringify(data.data));
        window.location.href = 'dashboard.html';
      } else {
        message.textContent = data.message;
      }
    } catch (error) {
      message.textContent = 'Error de conexión';
    }
  });
}