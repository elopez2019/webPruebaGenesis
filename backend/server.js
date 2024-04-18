const express = require('express');
const cors = require('cors'); // Importa el módulo cors
const mysql = require('mysql');
const { promisify } = require('util');


const app = express();
const port = 3001;

// Usa el middleware cors
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'inventario_mariscos',
  port: 3306 
});

connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

app.use(express.json());

// Operaciones CRUD para la tabla Productos

// Agregar un nuevo producto
app.post('/api/productos', (req, res) => {
  const { nombre_producto, descripcion, precio_por_libra, cantidad_en_existencia } = req.body;
  const sql = 'INSERT INTO Productos (nombre_producto, descripcion, precio_por_libra, cantidad_en_existencia) VALUES (?, ?, ?, ?)';
  connection.query(sql, [nombre_producto, descripcion, precio_por_libra, cantidad_en_existencia], (error, result) => {
    if (error) {
      console.error('Error al agregar un nuevo producto:', error);
      res.status(500).send('Error al agregar un nuevo producto');
    } else {
      console.log('Nuevo producto agregado:', result);
      res.status(201).send('Producto agregado correctamente');
    }
  });
});

// Obtener todos los productos
app.get('/productos', (req, res) => {
  const sql = 'SELECT * FROM Productos';
  connection.query(sql, (error, result) => {
    if (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).send('Error al obtener los productos');
    } else {
      res.json(result);
    }
  });
});

// Obtener un producto por su ID
app.get('/productos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Productos WHERE id_producto = ?';
  connection.query(sql, [id], (error, result) => {
    if (error) {
      console.error('Error al obtener el producto:', error);
      res.status(500).send('Error al obtener el producto');
    } else {
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

// Actualizar un producto
app.put('/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre_producto, descripcion, precio_por_libra, cantidad_en_existencia } = req.body;
  const sql = 'UPDATE Productos SET nombre_producto = ?, descripcion = ?, precio_por_libra = ?, cantidad_en_existencia = ? WHERE id_producto = ?';
  connection.query(sql, [nombre_producto, descripcion, precio_por_libra, cantidad_en_existencia, id], (error, result) => {
    if (error) {
      console.error('Error al actualizar el producto:', error);
      res.status(500).send('Error al actualizar el producto');
    } else {
      console.log('Producto actualizado:', result);
      res.status(200).send('Producto actualizado correctamente');
    }
  });
});

// Eliminar un producto
app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Productos WHERE id_producto = ?';
  connection.query(sql, [id], (error, result) => {
    if (error) {
      console.error('Error al eliminar el producto:', error);
      res.status(500).send('Error al eliminar el producto');
    } else {
      console.log('Producto eliminado:', result);
      res.status(200).send('Producto eliminado correctamente');
    }
  });
});

// Operaciones CRUD para la tabla Ventas

// Agregar una nueva venta
app.post('/api/ventas', (req, res) => {
  const { fecha_venta, tipo_venta, cantidad_vendida, id_producto, id_combo, tipo_empaque } = req.body;

  if (tipo_venta === 'libra' || tipo_venta === 'media_libra') {
    // Si es una venta de producto, insertar en Ventas_Productos
    const sqlVenta = 'INSERT INTO Ventas_Productos (fecha_venta, tipo_venta, cantidad_vendida, id_producto, tipo_empaque) VALUES (?, ?, ?, ?, ?)';
    const sqlUpdateProducto = 'UPDATE Productos SET cantidad_en_existencia = cantidad_en_existencia - ? WHERE id_producto = ?';

    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error al iniciar la transacción:', err);
        res.status(500).send('Error al procesar la venta');
        return;
      }

      connection.query(sqlVenta, [fecha_venta, tipo_venta, cantidad_vendida, id_producto, tipo_empaque], (error, resultVenta) => {
        if (error) {
          console.error('Error al agregar una nueva venta de producto:', error);
          res.status(500).send('Error al agregar una nueva venta de producto');
          return connection.rollback(() => {});
        } else {
          console.log('Nueva venta de producto agregada:', resultVenta);
          connection.query(sqlUpdateProducto, [cantidad_vendida, id_producto], (errorUpdate, resultUpdate) => {
            if (errorUpdate) {
              console.error('Error al actualizar la cantidad de producto:', errorUpdate);
              res.status(500).send('Error al actualizar la cantidad de producto');
              return connection.rollback(() => {});
            } else {
              console.log('Cantidad de producto actualizada correctamente:', resultUpdate);
              connection.commit((errCommit) => {
                if (errCommit) {
                  console.error('Error al confirmar la transacción:', errCommit);
                  res.status(500).send('Error al procesar la venta');
                } else {
                  res.status(201).send('Venta de producto agregada correctamente');
                }
              });
            }
          });
        }
      });
    });
  }  else if (tipo_venta === 'combo') {
    // Si es una venta de combo, insertar en Ventas_Combos
    const sqlVentaCombo = 'INSERT INTO Ventas_Combos (fecha_venta, tipo_venta, cantidad_vendida, id_combo, tipo_empaque) VALUES (?, ?, ?, ?, ?)';
    const sqlUpdateCombo = 'UPDATE Combo_Productos SET cantidad_en_combo = cantidad_en_combo - ? WHERE id_combo = ?';
   // const sqlUpdateProducto = 'UPDATE Productos SET cantidad_en_existencia = cantidad_en_existencia - ? WHERE id_producto = ?';


    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error al iniciar la transacción:', err);
        res.status(500).send('Error al procesar la venta');
        return;
      }

      connection.query(sqlVentaCombo, [fecha_venta, tipo_venta, cantidad_vendida, id_combo, tipo_empaque], (errorCombo, resultVentaCombo) => {
        if (errorCombo) {
          console.error('Error al agregar una nueva venta de combo:', errorCombo);
          res.status(500).send('Error al agregar una nueva venta de combo');
          return connection.rollback(() => {});
        }

        console.log('Nueva venta de combo agregada:', resultVentaCombo);

        connection.query(sqlUpdateCombo, [cantidad_vendida, id_combo], (errorUpdateCombo, resultUpdateCombo) => {
          if (errorUpdateCombo) {
            console.error('Error al actualizar la cantidad de combo:', errorUpdateCombo);
            res.status(500).send('Error al actualizar la cantidad de combo');
            return connection.rollback(() => {});
          }

          console.log('Cantidad de combo actualizada correctamente:', resultUpdateCombo);

          connection.commit((errCommitCombo) => {
            if (errCommitCombo) {
              console.error('Error al confirmar la transacción:', errCommitCombo);
              res.status(500).send('Error al procesar la venta');
            } else {
              res.status(201).send('Venta de combo agregada correctamente');
            }
          });
        });
      });
    });
  } else {
    // Tipo de venta no reconocido
    res.status(400).send('Tipo de venta no válido');
  }
});



// Obtener todas las ventas
app.get('/ventas', (req, res) => {
  const sql = 'SELECT * FROM Ventas';
  connection.query(sql, (error, result) => {
    if (error) {
      console.error('Error al obtener las ventas:', error);
      res.status(500).send('Error al obtener las ventas');
    } else {
      res.json(result);
    }
  });
});

// Obtener una venta por su ID
app.get('/ventas/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Ventas WHERE id_venta = ?';
  connection.query(sql, [id], (error, result) => {
    if (error) {
      console.error('Error al obtener la venta:', error);
      res.status(500).send('Error al obtener la venta');
    } else {
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).send('Venta no encontrada');
      }
    }
  });
});

// Actualizar una venta
app.put('/ventas/:id', (req, res) => {
  const { id } = req.params;
  const { fecha_venta, tipo_venta, cantidad_vendida_libra, cantidad_vendida_media_libra, cantidad_vendida_combo, id_producto, id_combo } = req.body;
  const sql = 'UPDATE Ventas SET fecha_venta = ?, tipo_venta = ?, cantidad_vendida_libra = ?, cantidad_vendida_media_libra = ?, cantidad_vendida_combo = ?, id_producto = ?, id_combo = ? WHERE id_venta = ?';
  connection.query(sql, [fecha_venta, tipo_venta, cantidad_vendida_libra, cantidad_vendida_media_libra, cantidad_vendida_combo, id_producto, id_combo, id], (error, result) => {
    if (error) {
      console.error('Error al actualizar la venta:', error);
      res.status(500).send('Error al actualizar la venta');
    } else {
      console.log('Venta actualizada:', result);
      res.status(200).send('Venta actualizada correctamente');
    }
  });
});

// Eliminar una venta
app.delete('/ventas/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Ventas WHERE id_venta = ?';
  connection.query(sql, [id], (error, result) => {
    if (error) {
      console.error('Error al eliminar la venta:', error);
      res.status(500).send('Error al eliminar la venta');
    } else {
      console.log('Venta eliminada:', result);
      res.status(200).send('Venta eliminada correctamente');
    }
  });
});

// Operaciones CRUD para la tabla combos
// Manejar la solicitud POST para agregar un combo y sus productos asociados
app.post('/api/combos', async (req, res) => {
  const { nombre_combo, precio_combo, productos } = req.body;

  try {
    // Crear un nuevo registro de combo en la tabla Combos
    const insertComboQuery = 'INSERT INTO Combos (nombre_combo, precio_combo) VALUES (?, ?)';
    const comboResult = await promisify(connection.query).bind(connection)(insertComboQuery, [nombre_combo, precio_combo]);

    // Obtener el ID del combo recién insertado
    const id_combo = comboResult.insertId;

    // Crear registros de asociación en la tabla Combo_Productos para cada producto asociado al combo
    const insertions = productos.map((producto) => {
      const { id_producto, cantidad_en_combo } = producto;
      const insertComboProductosQuery = 'INSERT INTO Combo_Productos (id_combo, id_producto, cantidad_en_combo) VALUES (?, ?, ?)';
      return promisify(connection.query).bind(connection)(insertComboProductosQuery, [id_combo, id_producto, cantidad_en_combo]);
    });

    // Esperar a que se completen todas las inserciones de productos
    await Promise.all(insertions);

    res.status(201).json({ message: 'Combo agregado exitosamente' });
  } catch (error) {
    console.error('Error al agregar combo:', error);
    res.status(500).json({ error: 'Error al agregar combo y/o productos al combo' });
  }
});

// Leer todos los combos
app.get('/combos', (req, res) => {
  const query = 'SELECT * FROM Combos';
  connection.query(query, (err, result) => {
    if (err) {
      res.status(500).send({ error: 'Error al obtener los combos desde la base de datos' });
      throw err;
    }
    res.send(result);
  });
});

// Actualizar un combo
app.put('/combos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre_combo, precio_combo } = req.body;
  const query = 'UPDATE Combos SET nombre_combo = ?, precio_combo = ? WHERE id_combo = ?';
  connection.query(query, [nombre_combo, precio_combo, id], (err, result) => {
    if (err) {
      res.status(500).send({ error: 'Error al actualizar el combo en la base de datos' });
      throw err;
    }
    res.send({ message: 'Combo actualizado correctamente' });
  });
});

// Eliminar un combo y sus productos asociados
app.delete('/combos/:id', (req, res) => {
  const { id } = req.params;
  const deleteComboQuery = 'DELETE FROM Combos WHERE id_combo = ?';
  const deleteComboProductosQuery = 'DELETE FROM Combo_Productos WHERE id_combo = ?';

  connection.beginTransaction((err) => {
    if (err) {
      res.status(500).send({ error: 'Error al eliminar el combo de la base de datos' });
      throw err;
    }

    connection.query(deleteComboQuery, id, (err, result) => {
      if (err) {
        connection.rollback(() => {
          res.status(500).send({ error: 'Error al eliminar el combo de la base de datos' });
          throw err;
        });
      }

      connection.query(deleteComboProductosQuery, id, (err, result) => {
        if (err) {
          connection.rollback(() => {
            res.status(500).send({ error: 'Error al eliminar los productos asociados al combo de la base de datos' });
            throw err;
          });
        }

        connection.commit((err) => {
          if (err) {
            connection.rollback(() => {
              res.status(500).send({ error: 'Error al eliminar el combo de la base de datos' });
              throw err;
            });
          }
          res.send({ message: 'Combo y productos asociados eliminados correctamente' });
        });
      });
    });
  });
});

// CRUD para la tabla Combo_Productos

// Crear un combo-producto
app.post('/api/combo_productos', (req, res) => {
  const { id_combo, id_producto, cantidad_en_combo } = req.body;
  const query = 'INSERT INTO Combo_Productos (id_combo, id_producto, cantidad_en_combo) VALUES (?, ?, ?)';
  connection.query(query, [id_combo, id_producto, cantidad_en_combo], (err, result) => {
    if (err) {
      res.status(500).send({ error: 'Error al agregar el combo-producto en la base de datos' });
      throw err;
    }
    res.send({ message: 'Combo-producto agregado correctamente' });
  });
});

// Leer todos los combo-productos
app.get('/combo_productos', (req, res) => {
  const query = 'SELECT * FROM Combo_Productos';
  connection.query(query, (err, result) => {
    if (err) {
      res.status(500).send({ error: 'Error al obtener los combo-productos desde la base de datos' });
      throw err;
    }
    res.send(result);
  });
});

// Actualizar un combo-producto
app.put('/combo_productos/:id', (req, res) => {
  const { id } = req.params;
  const { id_combo, id_producto, cantidad_en_combo } = req.body;
  const query = 'UPDATE Combo_Productos SET id_combo = ?, id_producto = ?, cantidad_en_combo = ? WHERE id_combo_producto = ?';
  connection.query(query, [id_combo, id_producto, cantidad_en_combo, id], (err, result) => {
    if (err) {
      res.status(500).send({ error: 'Error al actualizar el combo-producto en la base de datos' });
      throw err;
    }
    res.send({ message: 'Combo-producto actualizado correctamente' });
  });
});

// Eliminar un combo-producto
app.delete('/combo_productos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Combo_Productos WHERE id_combo_producto = ?';
  connection.query(query, id, (err, result) => {
    if (err) {
      res.status(500).send({ error: 'Error al eliminar el combo-producto de la base de datos' });
      throw err;
    }
    res.send({ message: 'Combo-producto eliminado correctamente' });
  });
});

// Operaciones CRUD para la tabla Inventarios

// Ruta para obtener ventas por día
app.get('/api/ventas/dia', (req, res) => {
  const query = `
    SELECT fecha_venta, SUM(cantidad_vendida) AS total_ventas
    FROM (
        SELECT fecha_venta, cantidad_vendida FROM Ventas_Productos
        UNION ALL
        SELECT fecha_venta, cantidad_vendida FROM Ventas_Combos
    ) AS all_sales
    GROUP BY fecha_venta
    ORDER BY fecha_venta;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener ventas por día:', error);
      res.status(500).json({ error: 'Error al obtener ventas por día' });
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener ventas por mes
app.get('/api/ventas/mes', (req, res) => {
  const query = `
    SELECT DATE_FORMAT(fecha_venta, '%Y-%m') AS mes, SUM(cantidad_vendida) AS total_ventas
    FROM (
        SELECT fecha_venta, cantidad_vendida FROM Ventas_Productos
        UNION ALL
        SELECT fecha_venta, cantidad_vendida FROM Ventas_Combos
    ) AS all_sales
    GROUP BY DATE_FORMAT(fecha_venta, '%Y-%m')
    ORDER BY mes;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener ventas por mes:', error);
      res.status(500).json({ error: 'Error al obtener ventas por mes' });
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener ganancias por día
app.get('/api/ganancias/dia', (req, res) => {
  const query = `
  SELECT fecha_venta, SUM(cantidad_vendida * precio_por_libra) AS total_ganancias
  FROM (
      SELECT vp.fecha_venta, vp.cantidad_vendida, p.precio_por_libra
      FROM Ventas_Productos vp
      INNER JOIN Productos p ON vp.id_producto = p.id_producto
      UNION ALL
      SELECT vc.fecha_venta, vc.cantidad_vendida, c.precio_combo AS precio
      FROM Ventas_Combos vc
      INNER JOIN Combos c ON vc.id_combo = c.id_combo
  ) AS all_sales
  GROUP BY fecha_venta
  ORDER BY fecha_venta;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener ganancias por día:', error);
      res.status(500).json({ error: 'Error al obtener ganancias por día' });
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener ganancias por mes
app.get('/api/ganancias/mes', (req, res) => {
  const query = `
  SELECT DATE_FORMAT(fecha_venta, '%Y-%m') AS mes, SUM(cantidad_vendida * precio_por_libra) AS total_ganancias
  FROM (
      SELECT vp.fecha_venta, vp.cantidad_vendida, p.precio_por_libra
      FROM Ventas_Productos vp
      INNER JOIN Productos p ON vp.id_producto = p.id_producto
      UNION ALL
      SELECT vc.fecha_venta, vc.cantidad_vendida, c.precio_combo AS precio_por_libra
      FROM Ventas_Combos vc
      INNER JOIN Combos c ON vc.id_combo = c.id_combo
  ) AS all_sales
  GROUP BY DATE_FORMAT(fecha_venta, '%Y-%m')
  ORDER BY mes;`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener ganancias por mes:', error);
      res.status(500).json({ error: 'Error al obtener ganancias por mes' });
      return;
    }
    res.json(results);
  });
});

// alertas inventario existencias
app.get('/alertas-inventario', (req, res) => {
  const sql = `
    SELECT id_producto, nombre_producto, cantidad_en_existencia
    FROM Productos
    WHERE cantidad_en_existencia < 5;
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al consultar la base de datos' });
      return;
    }
    res.json(results);
  });
});

// Escuchar en el puerto 
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
