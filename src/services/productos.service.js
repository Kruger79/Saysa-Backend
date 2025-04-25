const db = require('../database/config');

// Servicio para obtener todos los productos desde la base de datos
const obtenerProductosService = async () => {
  try {
    const pool = await db.poolPromise;
    const result = await pool.request().query('SELECT * FROM Productos');
    return result.recordset;
  } catch (error) {
    console.error('❌ Error en obtenerProductosService:', error);
    throw error;
  }
};

// Exportamos el servicio para poder usarlo en el controlador
module.exports = {
  obtenerProductosService
};
