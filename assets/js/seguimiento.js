const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const form = document.getElementById('seguimientoForm');
const message = document.getElementById('seguimientoMessage');
const table = document.getElementById('seguimientoTable');

async function cargarSeguimientos() {
  try {
    const response = await fetch(`${API_SEGUIMIENTO}/seguimientos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    table.innerHTML = '';

    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      table.innerHTML = '<tr><td colspan="7">Sin registros</td></tr>';
      return;
    }

    data.data.forEach(item => {
      table.innerHTML += `
        <tr>
          <td>${item.id ?? ''}</td>
          <td>${item.incapacidad_id ?? ''}</td>
          <td>${item.fecha ?? ''}</td>
          <td>${item.comentario ?? ''}</td>
          <td>${item.estado ?? ''}</td>
          <td>${item.usuario_responsable ?? ''}</td>
          <td>
            <button type="button" onclick='editarSeguimiento(${JSON.stringify(item).replaceAll("'", "\\'")})'>Editar</button>
            <button type="button" onclick='eliminarSeguimiento(${item.id})'>Eliminar</button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    message.textContent = 'Error cargando seguimientos';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('seguimientoId').value;
  const payload = {
    incapacidad_id: document.getElementById('incapacidad_id').value,
    fecha: document.getElementById('fecha').value,
    comentario: document.getElementById('comentario').value,
    estado: document.getElementById('estado').value,
    usuario_responsable: document.getElementById('usuario_responsable').value
  };

  try {
    const response = await fetch(
      id ? `${API_SEGUIMIENTO}/seguimientos/${id}` : `${API_SEGUIMIENTO}/seguimientos`,
      {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (data.success) {
      message.textContent = data.message || 'Operación realizada';
      form.reset();
      document.getElementById('seguimientoId').value = '';
      await cargarSeguimientos();
    } else {
      message.textContent = data.message || 'No se pudo guardar';
    }
  } catch (error) {
    message.textContent = 'Error guardando seguimiento';
  }
});

function editarSeguimiento(item) {
  document.getElementById('seguimientoId').value = item.id || '';
  document.getElementById('incapacidad_id').value = item.incapacidad_id || '';
  document.getElementById('fecha').value = item.fecha || '';
  document.getElementById('comentario').value = item.comentario || '';
  document.getElementById('estado').value = item.estado || 'registrada';
  document.getElementById('usuario_responsable').value = item.usuario_responsable || '';
}

async function eliminarSeguimiento(id) {
  if (!confirm('¿Seguro que deseas eliminar este seguimiento?')) return;

  try {
    const response = await fetch(`${API_SEGUIMIENTO}/seguimientos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    message.textContent = data.message || 'Seguimiento eliminado';
    await cargarSeguimientos();
  } catch (error) {
    message.textContent = 'Error eliminando seguimiento';
  }
}

window.editarSeguimiento = editarSeguimiento;
window.eliminarSeguimiento = eliminarSeguimiento;

cargarSeguimientos();