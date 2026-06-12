const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const form = document.getElementById('empleadoForm');
const message = document.getElementById('empleadoMessage');
const table = document.getElementById('empleadoTable');

async function cargarEmpleados(query = '') {
  try {
    const response = await fetch(`${API_EMPLEADOS}/empleados${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    table.innerHTML = '';

    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      table.innerHTML = '<tr><td colspan="11">Sin registros</td></tr>';
      return;
    }

    data.data.forEach(item => {
      table.innerHTML += `
        <tr>
          <td>${item.id ?? ''}</td>
          <td>${item.nombres ?? ''}</td>
          <td>${item.apellidos ?? ''}</td>
          <td>${item.documento ?? ''}</td>
          <td>${item.correo ?? ''}</td>
          <td>${item.telefono ?? ''}</td>
          <td>${item.cargo ?? ''}</td>
          <td>${item.area ?? ''}</td>
          <td>${item.fecha_ingreso ?? ''}</td>
          <td>${item.estado ?? ''}</td>
          <td>
            <button type="button" onclick='editarEmpleado(${JSON.stringify(item).replaceAll("'", "\\'")})'>Editar</button>
            <button type="button" onclick='cambiarEstadoEmpleado(${item.id}, "${item.estado === "activo" ? "inactivo" : "activo"}")'>
              ${item.estado === "activo" ? "Inactivar" : "Activar"}
            </button>
            <button type="button" onclick='eliminarEmpleado(${item.id})'>Eliminar</button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    message.textContent = 'Error cargando empleados';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('empleadoId').value;
  const payload = {
    nombres: document.getElementById('nombres').value,
    apellidos: document.getElementById('apellidos').value,
    documento: document.getElementById('documento').value,
    correo: document.getElementById('correo').value,
    telefono: document.getElementById('telefono').value,
    cargo: document.getElementById('cargo').value,
    area: document.getElementById('area').value,
    fecha_ingreso: document.getElementById('fecha_ingreso').value,
    estado: document.getElementById('estado').value
  };

  try {
    const response = await fetch(
      id ? `${API_EMPLEADOS}/empleados/${id}` : `${API_EMPLEADOS}/empleados`,
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
      document.getElementById('empleadoId').value = '';
      await cargarEmpleados();
    } else {
      message.textContent = data.message || 'No se pudo guardar';
    }
  } catch (error) {
    message.textContent = 'Error guardando empleado';
  }
});

function editarEmpleado(item) {
  document.getElementById('empleadoId').value = item.id || '';
  document.getElementById('nombres').value = item.nombres || '';
  document.getElementById('apellidos').value = item.apellidos || '';
  document.getElementById('documento').value = item.documento || '';
  document.getElementById('correo').value = item.correo || '';
  document.getElementById('telefono').value = item.telefono || '';
  document.getElementById('cargo').value = item.cargo || '';
  document.getElementById('area').value = item.area || '';
  document.getElementById('fecha_ingreso').value = item.fecha_ingreso || '';
  document.getElementById('estado').value = item.estado || 'activo';
}

async function cambiarEstadoEmpleado(id, estado) {
  try {
    const response = await fetch(`${API_EMPLEADOS}/empleados/${id}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ estado })
    });

    const data = await response.json();
    message.textContent = data.message || 'Estado actualizado';
    await cargarEmpleados();
  } catch (error) {
    message.textContent = 'Error cambiando estado';
  }
}

async function eliminarEmpleado(id) {
  if (!confirm('¿Seguro que deseas eliminar este empleado?')) return;

  try {
    const response = await fetch(`${API_EMPLEADOS}/empleados/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    message.textContent = data.message || 'Empleado eliminado';
    await cargarEmpleados();
  } catch (error) {
    message.textContent = 'Error eliminando empleado';
  }
}

document.getElementById('btnFiltrar').addEventListener('click', () => {
  const documento = document.getElementById('filtroDocumento').value.trim();
  const area = document.getElementById('filtroArea').value.trim();
  const estado = document.getElementById('filtroEstado').value;

  const params = new URLSearchParams();
  if (documento) params.append('documento', documento);
  if (area) params.append('area', area);
  if (estado) params.append('estado', estado);

  const query = params.toString() ? `?${params.toString()}` : '';
  cargarEmpleados(query);
});

document.getElementById('btnLimpiar').addEventListener('click', () => {
  document.getElementById('filtroDocumento').value = '';
  document.getElementById('filtroArea').value = '';
  document.getElementById('filtroEstado').value = '';
  cargarEmpleados();
});

window.editarEmpleado = editarEmpleado;
window.cambiarEstadoEmpleado = cambiarEstadoEmpleado;
window.eliminarEmpleado = eliminarEmpleado;

cargarEmpleados();