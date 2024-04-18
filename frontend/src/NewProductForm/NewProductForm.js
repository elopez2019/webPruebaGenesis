import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';


const NewProductForm = () => {
  const [productInfo, setProductInfo] = useState({
    id_producto: null,
    nombre_producto: '',
    descripcion: '',
    precio_por_libra: '',
    cantidad_en_existencia: ''
  });

  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isClearingForm, setIsClearingForm] = useState(false);


  useEffect(() => {
    // Llamar a la función para obtener todos los productos al cargar el componente
    getProducts();
  }, []); // El segundo argumento es un array vacío para asegurar que se ejecute solo una vez al montar el componente

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductInfo({ ...productInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        // Si hay un ID de producto en edición, realizar una solicitud PUT para actualizar el producto existente
        await axios.put(`http://localhost:3001/productos/${editingProductId}`, productInfo);
        console.log('Producto actualizado:', productInfo);
      } else {
        // Si no hay un ID de producto en edición, realizar una solicitud POST para agregar un nuevo producto
        await axios.post(`http://localhost:3001/api/productos`, productInfo);
        console.log('Nuevo producto enviado al backend:', productInfo);
      }
      // Actualiza la lista de productos
      getProducts();
      // Limpia el formulario después de enviar los datos
      setProductInfo({
        nombre_producto: '',
        descripcion: '',
        precio_por_libra: 0.00,
        cantidad_en_existencia: 0.00
      });
      // Restablecer el ID de producto en edición a null
      setEditingProductId(null);
    } catch (error) {
      console.error('Error al enviar el producto al backend:', error);
    }
  };
  
  
  const handleEdit = (id) => {
    // Establecer el ID del producto que se está editando
    setEditingProductId(id);
    
    // Encontrar el producto correspondiente en la lista de productos
    const editedProduct = products.find(product => product.id_producto === id);
    
    // Actualizar el estado del formulario con los detalles del producto a editar
    setProductInfo({
      id_producto: editedProduct.id,
      nombre_producto: editedProduct.nombre_producto,
      descripcion: editedProduct.descripcion,
      precio_por_libra: editedProduct.precio_por_libra,
      cantidad_en_existencia: editedProduct.cantidad_en_existencia
    });
  };
  

  const getProducts = async () => {
    try {
      // Obtener la lista actualizada de productos desde el backend
      const response = await axios.get('http://localhost:3001/productos');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de productos:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Eliminar el producto con el ID especificado
      await axios.delete(`http://localhost:3001/productos/${id}`);
      console.log('Producto eliminado:', id);
      // Actualizar la lista de productos después de eliminar
      getProducts();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const handleClearForm = () => {
    setProductInfo({
      nombre_producto: '',
      descripcion: '',
      precio_por_libra: 0.00,
      cantidad_en_existencia: 0.00
    });
  };
  

  // Estilos en línea
  const containerStyles = {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0', // Ajustar el margen superior e inferior
  };

  const formStyles = {
    maxWidth: '400px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    marginRight: '20px',
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
        <h2>Registro de Nuevo Producto</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre_producto">Nombre del Producto:</label>
          <input
            type="text"
            id="nombre_producto"
            name="nombre_producto"
            value={productInfo.nombre_producto}
            onChange={handleChange}
            required
            style={{ ...cellStyles, width: '100%', marginBottom: '16px' }}
          />
          <label htmlFor="descripcion">Descripción:</label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            value={productInfo.descripcion}
            onChange={handleChange}
            style={{ ...cellStyles, width: '100%', marginBottom: '16px' }}
          />
          <label htmlFor="precio_por_libra">Precio por Libra:</label>
          <input
            type="number"
            id="precio_por_libra"
            name="precio_por_libra"
            value={productInfo.precio_por_libra}
            onChange={handleChange}
            required
            style={{ ...cellStyles, width: '100%', marginBottom: '16px' }}
          />
          <label htmlFor="cantidad_en_existencia">Cantidad:</label>
          <input
            type="number"
            id="cantidad_en_existencia"
            name="cantidad_en_existencia"
            value={productInfo.cantidad_en_existencia}
            onChange={handleChange}
            required
            style={{ ...cellStyles, width: '100%', marginBottom: '16px' }}
          />
          <button type="submit" style={{ ...cellStyles, width: '100%', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' }}>{productInfo.id_producto ? 'Actualizar' : 'Registrar'}</button>
        </form>
      </div>
      <div>
        <h2>Lista de Productos</h2>
        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={cellStyles}>Nombre</th>
              <th style={cellStyles}>Descripción</th>
              <th style={cellStyles}>Precio por Libra</th>
              <th style={cellStyles}>Cantidad en Existencia</th>
              <th style={cellStyles}>Opciones</th>

            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td style={cellStyles}>{product.nombre_producto}</td>
                <td style={cellStyles}>{product.descripcion}</td>
                <td style={cellStyles}>{product.precio_por_libra}</td>
                <td style={cellStyles}>{product.cantidad_en_existencia}</td>
                <td style={cellStyles}>
                  <FaEdit
                    style={{ marginRight: '5px', cursor: 'pointer', color: 'green' }}
                    onClick={() => handleEdit(product.id_producto)}
                  />
                  <FaTrash
                    style={{ cursor: 'pointer', color: 'red' }}
                    onClick={() => handleDelete(product.id_producto)}
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

export default NewProductForm;
