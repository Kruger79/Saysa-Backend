const sql = require('mssql');
const db = require('../database/config');

const obtenerProductosService = async () => {
  const pool = await db.getConnection();
  const result = await pool.request().query('SELECT * FROM Productos WHERE Activo = 1');
  return result.recordset;
};

module.exports = { obtenerProductosService };
