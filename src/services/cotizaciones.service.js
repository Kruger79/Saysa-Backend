// Importa la conexión a la base de datos
const db = require('../database/config');
const sql = require('mssql');

// Servicio para crear una cotización con su detalle (carrito de compra)
const crearCotizacionConDetalleService = async (data) => {
  const { cedula, productos } = data;

  try {
    // Conexión a la base de datos
    const pool = await db.getConnection();

    // Obtener el ID del usuario con base en la cédula
    const resultUsuario = await pool
      .request()
      .input('cedula', sql.NVarChar, cedula)
      .query('SELECT IdUsuario FROM Clientes WHERE Cedula = @cedula');

    if (resultUsuario.recordset.length === 0) {
      throw new Error('No se encontró un usuario con esa cédula');
    }

    const idUsuario = resultUsuario.recordset[0].IdUsuario;

    // Insertar en Cotizaciones
    const resultCotizacion = await pool
      .request()
      .input('idUsuario', sql.Int, idUsuario)
      .query(`
        INSERT INTO Cotizaciones (IdUsuario, Estado, FechaSolicitud)
        OUTPUT INSERTED.IdCotizacion
        VALUES (@idUsuario, 'Pendiente', GETDATE());
      `);

    const idCotizacion = resultCotizacion.recordset[0].IdCotizacion;

    // Insertar productos en DetalleCotizacion
    for (const producto of productos) {
      await pool
        .request()
        .input('idCotizacion', sql.Int, idCotizacion)
        .input('idProducto', sql.Int, producto.idProducto)
        .input('cantidad', sql.Int, producto.cantidad)
        .input('precioUnitario', sql.Money, producto.precioUnitario)
        .input('tiempoEntrega', sql.NVarChar, producto.tiempoEntrega || '')
        .input('garantia', sql.NVarChar, producto.garantia || '')
        .query(`
          INSERT INTO DetalleCotizacion (IdCotizacion, IdProducto, Cantidad, PrecioUnitario, TiempoEntrega, Garantia)
          VALUES (@idCotizacion, @idProducto, @cantidad, @precioUnitario, @tiempoEntrega, @garantia);
        `);
    }

    return {
      mensaje: 'Cotización creada con éxito',
      idCotizacion
    };
  } catch (error) {
    console.error('❌ Error en crearCotizacionConDetalle:', error);
    throw error;
  }
};

// Servicio para obtener cotizaciones por cédula
const obtenerCotizacionesService = async (cedula) => {
  try {
    const pool = await db.getConnection();

    // Buscar cotizaciones que pertenezcan al usuario con esa cédula
    const result = await pool
      .request()
      .input('cedula', sql.NVarChar, cedula)
      .query(`
        SELECT C.IdCotizacion, C.Estado, C.FechaSolicitud
        FROM Cotizaciones C
        JOIN Clientes CL ON C.IdUsuario = CL.IdUsuario
        WHERE CL.Cedula = @cedula
        ORDER BY C.FechaSolicitud DESC;
      `);

    return result.recordset;
  } catch (error) {
    console.error('❌ Error en obtenerCotizacionesService:', error);
    throw error;
  }
};

module.exports = {
  crearCotizacionConDetalleService,
  obtenerCotizacionesService
};
