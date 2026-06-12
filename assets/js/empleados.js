const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const form = document.getElementById('employeeForm');
const message = document.getElementById('employeeMessage');
const table = document.getElementById('employeeTable');

async function cargarEmpleados() {
  try {
    const response = await fetch(`${API_EMPLEADOS}/empleados`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    table.innerHTML = '';

    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      table.innerHTML = '<tr><td colspan="11">Sin registros</td></tr>';
      return;
    }

    data.data.forEach(emp => {
      table.innerHTML += `
        <tr>
          <td>${emp.id ?? ''}</td>
          <td>${emp.nombres ?? ''}</td>
          <td>${emp.apellidos ?? ''}</td>
          <td>${emp.documento ?? ''}</td>
          <td>${emp.correo ?? ''}</td>
          <td>${emp.telefono ?? ''}</td>
          <td>${emp.cargo ?? ''}</td>
          <td>${emp.area ?? ''}</td>
          <td>${emp.fecha_ingreso ?? ''}</td>
          <td>${emp.estado ?? ''}</td>
          <td>
            <button type="button" onclick='editarEmpleado(${JSON.stringify(emp).replaceAll("'", "\\'")})'>Editar</button>
            <button type="button" onclick='eliminarEmpleado(${emp.id})'>Eliminar</button>
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

  const id = document.getElementById('employeeId').value;
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
      document.getElementById('employeeId').value = '';
      await cargarEmpleados();
    } else {
      message.textContent = data.message || 'No se pudo guardar';
    }
  } catch (error) {
    message.textContent = 'Error guardando empleado';
  }
});

function editarEmpleado(emp) {
  document.getElementById('employeeId').value = emp.id || '';
  document.getElementById('nombres').value = emp.nombres || '';
  document.getElementById('apellidos').value = emp.apellidos || '';
  document.getElementById('documento').value = emp.documento || '';
  document.getElementById('correo').value = emp.correo || '';
  document.getElementById('telefono').value = emp.telefono || '';
  document.getElementById('cargo').value = emp.cargo || '';
  document.getElementById('area').value = emp.area || '';
  document.getElementById('fecha_ingreso').value = emp.fecha_ingreso || '';
  document.getElementById('estado').value = emp.estado || 'activo';
}

async function eliminarEmpleado(id) {
  if (!confirm('¿Seguro que deseas eliminar este empleado?')) return;

  try {
    const response = await fetch(`${API_EMPLEADOS}/empleados/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    message.textContent = data.message || 'Empleado eliminado';
    await cargarEmpleados();
  } catch (error) {
    message.textContent = 'Error eliminando empleado';
  }
}

window.editarEmpleado = editarEmpleado;
window.eliminarEmpleado = eliminarEmpleado;

cargarEmpleados();