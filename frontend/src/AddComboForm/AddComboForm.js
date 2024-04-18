import React, { useState, useEffect } from 'react';
import axios from 'axios';
// eslint-disable-next-line
import { FaTrash } from 'react-icons/fa';


const AddComboForm = () => {
  const [comboInfo, setComboInfo] = useState({
    nombre_combo: '',
    precio_combo: 0.00,
    productos: [{ id_producto: '', cantidad_en_combo: 0 }],
  });
  const [productosOptions, setProductosOptions] = useState([]);
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    // Llamar a la función para obtener la lista de productos al cargar el componente
    getProductos();
    // Obtener la lista de combos al cargar el componente
    getCombos();
  }, []);

  const getProductos = async () => {
    try {
      // Obtener la lista de productos desde el backend
      const response = await axios.get('http://localhost:3001/productos');
      setProductosOptions(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de productos:', error);
    }
  };

  const getCombos = async () => {
    try {
      // Obtener la lista de combos desde el backend
      const response = await axios.get('http://localhost:3001/combos');
      setCombos(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de combos:', error);
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'producto') {
      const newProductos = [...comboInfo.productos];
      newProductos[index].id_producto = value;
      setComboInfo({ ...comboInfo, productos: newProductos });
    } else if (name === 'cantidad_en_combo') {
      const newProductos = [...comboInfo.productos];
      newProductos[index].cantidad_en_combo = value;
      setComboInfo({ ...comboInfo, productos: newProductos });
    } else {
      setComboInfo({ ...comboInfo, [name]: value });
    }
  };

  const handleAddProduct = () => {
    setComboInfo({
      ...comboInfo,
      productos: [...comboInfo.productos, { id_producto: '', cantidad_en_combo: 0 }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/combos', comboInfo);
      console.log('Combo agregado:', response.data);
      // Reiniciar el formulario después de agregar el combo
      setComboInfo({
        nombre_combo: '',
        precio_combo: 0.00,
        productos: [{ id_producto: '', cantidad_en_combo: 0 }],
      });
      // Actualizar la lista de combos después de agregar uno nuevo
      getCombos();
    } catch (error) {
      console.error('Error al agregar combo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Eliminar el combo con el ID especificado
      await axios.delete(`http://localhost:3001/combos/${id}`);
      console.log('Combo eliminado:', id);
      // Actualizar la lista de combos después de eliminar
      getCombos();
    } catch (error) {
      console.error('Error al eliminar el combo:', error);
    }
  };


  const containerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: '20px', // Agregar margen superior
  };

  const formStyles = {
    width: '400px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  };

  const tableStyles = {
    borderCollapse: 'collapse',
    width: '100%',
  };

  const cellStyles = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  };

  return (
    <div style={containerStyles}>
      <div style={formStyles}>
        <h2>Agregar Combo</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre_combo">Nombre del Combo:</label>
          <input
            type="text"
            id="nombre_combo"
            name="nombre_combo"
            value={comboInfo.nombre_combo}
            onChange={handleChange}
            required
            style={{ ...cellStyles, width: '100%', marginBottom: '16px' }}
          />
          <label htmlFor="precio_combo">Precio del Combo:</label>
          <input
            type="number"
            id="precio_combo"
            name="precio_combo"
            value={comboInfo.precio_combo}
            onChange={handleChange}
            required
            style={{ ...cellStyles, width: '100%', marginBottom: '16px' }}
          />
          {comboInfo.productos.map((producto, index) => (
            <div key={index}>
              <label htmlFor={`producto-${index}`}>Producto:</label>
              <select
                id={`producto-${index}`}
                name="producto"
                value={producto.id_producto}
                onChange={(e) => handleChange(e, index)}
                required
                style={{ ...cellStyles, width: '100%', marginBottom: '16px' }}
              >
                <option value="">Seleccione un Producto...</option>
                {productosOptions.map((productoOption) => (
                  <option key={productoOption.id_producto} value={productoOption.id_producto}>
                    {productoOption.nombre_producto}
                  </option>
                ))}
              </select>
              <label htmlFor={`cantidad_en_combo-${index}`}>Cantidad:</label>
              <input
                type="number"
                id={`cantidad_en_combo-${index}`}
                name="cantidad_en_combo"
                value={producto.cantidad_en_combo}
                onChange={(e) => handleChange(e, index)}
                required
                style={{ ...cellStyles, width: '100%', marginBottom: '16px' }}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddProduct} style={{ ...cellStyles, width: '100%', backgroundColor: '#ccc', color: '#000', cursor: 'pointer', marginTop: '16px' }}>Agregar Producto</button>
          <button type="submit" style={{ ...cellStyles, width: '100%', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer', marginTop: '16px' }}>Agregar Combo</button>
        </form>
      </div>
      <div style={{ marginLeft: '20px' }}>
        <h2>Lista de Combos</h2>
        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={cellStyles}>Nombre del Combo</th>
              <th style={cellStyles}>Precio del Combo</th>
              <th style={cellStyles}>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {combos.map((combo, index) => (
              <tr key={index}>
                <td style={cellStyles}>{combo.nombre_combo}</td>
                <td style={cellStyles}>{combo.precio_combo}</td>
                <td style={cellStyles}>
                  <FaTrash
                    style={{ cursor: 'pointer', color: 'red' }}
                    onClick={() => handleDelete(combo.id_combo)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddComboForm;
