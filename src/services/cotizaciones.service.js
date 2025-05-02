// src/services/cotizaciones.service.js
const { poolPromise, sql } = require("../database/config");

const crearCotizacionConDetalleService = async (cedula, productos) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const request = new sql.Request(transaction);
    const fechaSolicitud = new Date();

    // Obtener IdUsuario por cédula
    const resultadoUsuario = await request
      .input("cedula", sql.VarChar, cedula)
      .query("SELECT IdUsuario FROM Clientes WHERE Cedula = @cedula");

    if (resultadoUsuario.recordset.length === 0) {
      throw new Error("Cliente no encontrado con esa cédula");
    }

    const idUsuario = resultadoUsuario.recordset[0].IdUsuario;

    // Insertar Cotización
    const resultadoCotizacion = await request
      .input("IdUsuario", sql.Int, idUsuario)
      .input("FechaSolicitud", sql.DateTime, fechaSolicitud)
      .input("Estado", sql.VarChar, "Pendiente")
      .query(`
        INSERT INTO Cotizaciones (IdUsuario, FechaSolicitud, Estado)
        OUTPUT INSERTED.IdCotizacion
        VALUES (@IdUsuario, @FechaSolicitud, @Estado)
      `);

    const idCotizacion = resultadoCotizacion.recordset[0].IdCotizacion;

    // Insertar DetalleCotización
    for (const producto of productos) {
      await new sql.Request(transaction)
        .input("IdCotizacion", sql.Int, idCotizacion)
        .input("IdProducto", sql.Int, producto.idProducto)
        .input("Cantidad", sql.Int, producto.cantidad)
        .input("PrecioUnitario", sql.Int, producto.precioUnitario)
        .query(`
          INSERT INTO DetalleCotizacion (IdCotizacion, IdProducto, Cantidad, PrecioUnitario)
          VALUES (@IdCotizacion, @IdProducto, @Cantidad, @PrecioUnitario)
        `);
    }

    await transaction.commit();
    return { idCotizacion };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const obtenerCotizacionesService = async (cedula) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input("cedula", sql.VarChar, cedula)
    .query(`
      SELECT 
        c.IdCotizacion,
        c.FechaSolicitud,
        c.Estado,
        ISNULL(SUM(dc.PrecioUnitario * dc.Cantidad), 0) AS Total
      FROM Cotizaciones c
      INNER JOIN Clientes u ON c.IdUsuario = u.IdUsuario
      LEFT JOIN DetalleCotizacion dc ON dc.IdCotizacion = c.IdCotizacion
      WHERE u.Cedula = Cedula
      GROUP BY c.IdCotizacion, c.FechaSolicitud, c.Estado
      ORDER BY c.IdCotizacion DESC
    `);

  return result.recordset;
};

module.exports = {
  crearCotizacionConDetalleService,
  obtenerCotizacionesService
};
