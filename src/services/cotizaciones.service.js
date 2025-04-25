// src/services/cotizaciones.service.js

const { poolPromise, sql } = require('../database/config');

// Servicio para crear una cotización con sus productos
const crearCotizacionConDetalleService = async (cedula, productos) => {
  try {
    const pool = await poolPromise;

    // Obtener el ID del usuario a partir de la cédula
    const resultCliente = await pool
      .request()
      .input('Cedula', sql.NVarChar, cedula)
      .query('SELECT IdUsuario FROM Clientes WHERE Cedula = @Cedula');

    if (resultCliente.recordset.length === 0) {
      throw new Error('Cliente no encontrado');
    }

    const idUsuario = resultCliente.recordset[0].IdUsuario;

    // Insertar cotización
    const resultCotizacion = await pool
      .request()
      .input('IdUsuario', sql.Int, idUsuario)
      .input('Estado', sql.NVarChar, 'Pendiente')
      .query(`
        INSERT INTO Cotizaciones (IdUsuario, Estado, FechaSolicitud)
        OUTPUT INSERTED.IdCotizacion
        VALUES (@IdUsuario, @Estado, GETDATE())
      `);

    const idCotizacion = resultCotizacion.recordset[0].IdCotizacion;

    // Insertar productos del detalle
    for (const producto of productos) {
      await pool
        .request()
        .input('IdCotizacion', sql.Int, idCotizacion)
        .input('IdProducto', sql.Int, producto.idProducto)
        .input('Cantidad', sql.Int, producto.cantidad)
        .input('PrecioUnitario', sql.Money, producto.precioUnitario)
        .query(`
          INSERT INTO DetalleCotizacion (IdCotizacion, IdProducto, Cantidad, PrecioUnitario)
          VALUES (@IdCotizacion, @IdProducto, @Cantidad, @PrecioUnitario)
        `);
    }

    return {
      mensaje: 'Cotización creada con éxito',
      idCotizacion
    };

  } catch (error) {
    console.error('❌ Error en crearCotizacionConDetalleService:', error);
    throw error;
  }
};

// Servicio para obtener cotizaciones por cédula
const obtenerCotizacionesService = async (cedula) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('Cedula', sql.NVarChar, cedula)
      .query(`
        SELECT c.IdCotizacion, c.Estado, c.FechaSolicitud
        FROM Cotizaciones c
        INNER JOIN Clientes cl ON c.IdUsuario = cl.IdUsuario
        WHERE cl.Cedula = @Cedula
      `);

    return result.recordset;

  } catch (error) {
    console.error('❌ Error en obtenerCotizacionesService:', error);
    throw error;
  }
};

// Exportar funciones correctamente
module.exports = {
  crearCotizacionConDetalleService,
  obtenerCotizacionesService
};
