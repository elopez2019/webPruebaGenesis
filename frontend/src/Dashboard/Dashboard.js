import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Paper, Typography, List, ListItem } from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [ventasDia, setVentasDia] = useState([]);
  const [ventasMes, setVentasMes] = useState([]);
  const [gananciasDia, setGananciasDia] = useState([]);
  const [gananciasMes, setGananciasMes] = useState([]);
  const [alertaInventario, setAlertaInventario] = useState([]);

  useEffect(() => {
    obtenerVentasDia();
    obtenerVentasMes();
    obtenerGananciasDia();
    obtenerGananciasMes();
    verificarAlertaInventario();
  }, []);

  const obtenerVentasDia = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/ventas/dia');
      setVentasDia(response.data);
    } catch (error) {
      console.error('Error al obtener ventas por día:', error);
    }
  };

  const obtenerVentasMes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/ventas/mes');
      setVentasMes(response.data);
    } catch (error) {
      console.error('Error al obtener ventas por mes:', error);
    }
  };

  const obtenerGananciasDia = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/ganancias/dia');
      setGananciasDia(response.data);
    } catch (error) {
      console.error('Error al obtener ganancias por día:', error);
    }
  };

  const obtenerGananciasMes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/ganancias/mes');
      setGananciasMes(response.data);
    } catch (error) {
      console.error('Error al obtener ganancias por mes:', error);
    }
  };

  const verificarAlertaInventario = () => {
    // Aquí debes implementar la lógica para verificar las existencias y actualizar la alerta
    // Por ejemplo, puedes consultar los productos y verificar si alguno tiene una cantidad en existencia por debajo de 5 libras
    // Luego, actualiza el estado de alerta con los productos que cumplen la condición
    const productosConPocaExistencia = []; // Aquí debes llenar el array con los productos con poca existencia
    setAlertaInventario(productosConPocaExistencia);
  };

  return (
    <div>
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h6" gutterBottom>Alerta de Inventario</Typography>
        <List>
          {alertaInventario.map(producto => (
            <ListItem key={producto.id}>
              Producto: {producto.nombre}, Existencia: {producto.existencia}
            </ListItem>
          ))}
        </List>
      </Paper>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>Ventas por Día</Typography>
            <LineChart width={500} height={300} data={ventasDia}>
              <XAxis dataKey="fecha_venta" />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_ventas" stroke="#8884d8" />
            </LineChart>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>Ventas por Mes</Typography>
            <LineChart width={500} height={300} data={ventasMes}>
              <XAxis dataKey="mes" />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_ventas" stroke="#8884d8" />
            </LineChart>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>Ganancias por Día</Typography>
            <LineChart width={500} height={300} data={gananciasDia}>
              <XAxis dataKey="fecha_venta" />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_ganancias" stroke="#82ca9d" />
            </LineChart>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>Ganancias por Mes</Typography>
            <LineChart width={500} height={300} data={gananciasMes}>
              <XAxis dataKey="mes" />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_ganancias" stroke="#82ca9d" />
            </LineChart>
          </Paper>
        </Grid>
      </Grid>
      
    </div>
  );
};

export default Dashboard;
