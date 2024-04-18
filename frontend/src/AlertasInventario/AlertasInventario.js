import React, { useState, useEffect } from 'react';

function AlertasInventario() {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/alertas-inventario')
      .then(response => response.json())
      .then(data => setAlertas(data))
      .catch(error => console.error('Error al obtener alertas de inventario:', error));
  }, []);

  return (
    <div>
      <h2>Alertas de Inventario</h2>
      <ul>
        {alertas.map(alerta => (
          <li key={alerta.id_producto}>
            {alerta.nombre_producto} - Cantidad en existencia: {alerta.cantidad_en_existencia}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlertasInventario;
