const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const form = document.getElementById('incapacidadForm');
const message = document.getElementById('incapacidadMessage');
const table = document.getElementById('incapacidadTable');

async function cargarIncapacidades() {
  try {
    const response = await fetch(`${API_INCAPACIDADES}/incapacidades`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    table.innerHTML = '';

    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      table.innerHTML = '<tr><td colspan="10">Sin registros</td></tr>';
      return;
    }

    data.data.forEach(item => {
      table.innerHTML += `
        <tr>
          <td>${item.id ?? ''}</td>
          <td>${item.empleado_id ?? ''}</td>
          <td>${item.fecha_inicio ?? ''}</td>
          <td>${item.fecha_fin ?? ''}</td>
          <td>${item.tipo ?? ''}</td>
          <td>${item.diagnostico_general ?? ''}</td>
          <td>${item.entidad_medica ?? ''}</td>
          <td>${item.dias_incapacidad ?? ''}</td>
          <td>${item.estado ?? ''}</td>
          <td>
            <button type="button" onclick='editarIncapacidad(${JSON.stringify(item).replaceAll("'", "\\'")})'>Editar</button>
            <button type="button" onclick='finalizarIncapacidad(${item.id})'>Finalizar</button>
            <button type="button" onclick='eliminarIncapacidad(${item.id})'>Eliminar</button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    message.textContent = 'Error cargando incapacidades';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('incapacidadId').value;
    const payload = {
    empleado_id: document.getElementById('empleado_id').value,
    fecha_inicio: document.getElementById('fecha_inicio').value,
    fecha_fin: document.getElementById('fecha_fin').value,
    tipo: document.getElementById('tipo').value,
    diagnostico_general: document.getElementById('diagnostico_general').value,
    entidad_medica: document.getElementById('entidad_medica').value,
    observaciones: document.getElementById('observaciones').value,
    estado: document.getElementById('estado').value
    };

  try {
    const response = await fetch(
      id ? `${API_INCAPACIDADES}/incapacidades/${id}` : `${API_INCAPACIDADES}/incapacidades`,
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
      document.getElementById('incapacidadId').value = '';
      await cargarIncapacidades();
    } else {
      message.textContent = data.message || 'No se pudo guardar';
    }
  } catch (error) {
    message.textContent = 'Error guardando incapacidad';
  }
});

function editarIncapacidad(item) {
  document.getElementById('incapacidadId').value = item.id || '';
  document.getElementById('empleado_id').value = item.empleado_id || '';
  document.getElementById('fecha_inicio').value = item.fecha_inicio || '';
  document.getElementById('fecha_fin').value = item.fecha_fin || '';
  document.getElementById('tipo').value = item.tipo || 'enfermedad_general';
  document.getElementById('diagnostico_general').value = item.diagnostico_general || '';
  document.getElementById('entidad_medica').value = item.entidad_medica || '';
  document.getElementById('observaciones').value = item.observaciones || '';
  document.getElementById('estado').value = item.estado || 'registrada';
}

async function finalizarIncapacidad(id) {
  try {
    const response = await fetch(`${API_INCAPACIDADES}/incapacidades/${id}/finalizar`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    message.textContent = data.message || 'Incapacidad finalizada';
    await cargarIncapacidades();
  } catch (error) {
    message.textContent = 'Error finalizando incapacidad';
  }
}

async function eliminarIncapacidad(id) {
  if (!confirm('¿Seguro que deseas eliminar esta incapacidad?')) return;

  try {
    const response = await fetch(`${API_INCAPACIDADES}/incapacidades/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    message.textContent = data.message || 'Incapacidad eliminada';
    await cargarIncapacidades();
  } catch (error) {
    message.textContent = 'Error eliminando incapacidad';
  }
}

window.editarIncapacidad = editarIncapacidad;
window.finalizarIncapacidad = finalizarIncapacidad;
window.eliminarIncapacidad = eliminarIncapacidad;

cargarIncapacidades();