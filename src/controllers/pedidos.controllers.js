const { sql, poolPromise } = require('../db');

async function listarProductos(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Productos WHERE Activo = 1');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener productos');
  }
}
