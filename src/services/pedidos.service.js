const { sql, poolPromise } = require('../database/config');

// Servicio: obtener pedidos por cédula
const obtenerPedidosPorCedulaService = async (cedula) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('Cedula', sql.NVarChar, cedula)
      .query(`
        SELECT cl.Cedula, p.Nombre AS NombreProducto, dc.Cantidad, dc.PrecioUnitario
        FROM Cotizaciones c
        INNER JOIN DetalleCotizacion dc ON c.IdCotizacion = dc.IdCotizacion
        INNER JOIN Productos p ON dc.IdProducto = p.IdProducto
        INNER JOIN Clientes cl ON c.IdUsuario = cl.IdUsuario
        WHERE cl.Cedula = @Cedula
      `);

    return result.recordset;
  } catch (error) {
    console.error('❌ Error en obtenerPedidosPorCedulaService:', error);
    throw error;
  }
};

module.exports = {
  obtenerPedidosPorCedulaService
};
