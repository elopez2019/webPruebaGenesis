import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SaleForm = () => {
  const [saleInfo, setSaleInfo] = useState({
    tipo_venta: '',
    producto_combo_id: '',
    cantidad_vendida: '',
    tipo_empaque: '', // Nuevo campo para el tipo de empaque
  });
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    // Llamar a la función para obtener todos los productos y combos al cargar el componente
    getProducts();
    getCombos();
  }, []); // El segundo argumento es un array vacío para asegurar que se ejecute solo una vez al montar el componente

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaleInfo({ ...saleInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Determinar qué valores asignar a id_producto y id_combo
      let productoId = 0;
      let comboId = 0;
      if (saleInfo.tipo_venta === 'libra' || saleInfo.tipo_venta === 'media_libra') {
        productoId = saleInfo.producto_combo_id;
      } else if (saleInfo.tipo_venta === 'combo') {
        comboId = saleInfo.producto_combo_id;
      }
      
      // Envía los datos de la venta al backend
      await axios.post(`http://localhost:3001/api/ventas`, {
        fecha_venta: new Date().toISOString().slice(0, 10), // Obtener la fecha actual
        tipo_venta: saleInfo.tipo_venta,
        cantidad_vendida: saleInfo.cantidad_vendida,
        id_producto: productoId,
        id_combo: comboId,
        tipo_empaque: saleInfo.tipo_empaque,
      });
      console.log('Venta registrada:', saleInfo);
      // Limpiar el formulario después de registrar la venta
      setSaleInfo({
        tipo_venta: '',
        producto_combo_id: '',
        cantidad_vendida: '',
        tipo_empaque: '', // Limpiar el campo del tipo de empaque
      });
    } catch (error) {
      console.error('Error al registrar la venta:', error);
    }
  };



  const getProducts = async () => {
    try {
      // Obtener la lista de productos desde el backend
      const response = await axios.get('http://localhost:3001/productos');
      setProducts(response.data);
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

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const formStyles = {
    width: '400px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
  };

  const inputStyles = {
    width: '100%',
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  };

  const buttonStyles = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyles}>
      <h2>Registrar Venta</h2>
      <form style={formStyles} onSubmit={handleSubmit}>
        <label htmlFor="tipo_venta">Tipo de Venta:</label>
        <select
          id="tipo_venta"
          name="tipo_venta"
          value={saleInfo.tipo_venta}
          onChange={handleChange}
          required
          style={inputStyles}
        >
          <option value="">Seleccione...</option>
          <option value="libra">Libra</option>
          <option value="media_libra">Media Libra</option>
          <option value="combo">Combo</option>
        </select>

        {saleInfo.tipo_venta === 'combo' && (
          <div>
            <label htmlFor="producto_combo_id">Combo:</label>
            <select
              id="producto_combo_id"
              name="producto_combo_id"
              value={saleInfo.producto_combo_id}
              onChange={handleChange}
              required
              style={inputStyles}
            >
              <option value="">Seleccione un Combo...</option>
              {combos.map((combo) => (
                <option key={combo.id_combo} value={combo.id_combo}>{combo.nombre_combo}</option>
              ))}
            </select>
          </div>
        )}

        {saleInfo.tipo_venta !== 'combo' && (
          <div>
            <label htmlFor="producto_combo_id">Producto:</label>
            <select
              id="producto_combo_id"
              name="producto_combo_id"
              value={saleInfo.producto_combo_id}
              onChange={handleChange}
              required
              style={inputStyles}
            >
              <option value="">Seleccione un Producto...</option>
              {products.map((product) => (
                <option key={product.id_producto} value={product.id_producto}>{product.nombre_producto}</option>
              ))}
            </select>
          </div>
        )}

        <label htmlFor="cantidad_vendida">Cantidad Vendida:</label>
        <input
          type="number"
          id="cantidad_vendida"
          name="cantidad_vendida"
          value={saleInfo.cantidad_vendida}
          onChange={handleChange}
          required
          style={inputStyles}
        />

        {/* Nuevo campo para seleccionar tipo de empaque */}
        <label htmlFor="tipo_empaque">Tipo de Empaque:</label>
        <select
          id="tipo_empaque"
          name="tipo_empaque"
          value={saleInfo.tipo_empaque}
          onChange={handleChange}
          required
          style={inputStyles}
        >
          <option value="">Seleccione...</option>
          <option value="caja_4_libras">Caja de 4 Libras</option>
          <option value="caja_3_libras">Caja de 3 Libras</option>
        </select>

        <button type="submit" style={buttonStyles}>Registrar Venta</button>
      </form>
    </div>
  );
};

export default SaleForm;
