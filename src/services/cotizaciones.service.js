const { poolPromise } = require('../database/config');

const crearCotizacion = async (cedula, productos, nombreFinca, precioEnvio) => {
  const pool = await poolPromise;
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    const fechaActual = new Date();

    // Obtener IdUsuario desde Clientes
    const usuario = await pool
      .request()
      .input("Cedula", cedula)
      .query(`SELECT IdUsuario FROM Clientes WHERE Cedula = @Cedula`);

    if (!usuario.recordset.length) {
      throw new Error("No se encontró un cliente con esa cédula");
    }

    const idUsuario = usuario.recordset[0].IdUsuario;

    // Calcular total de la cotización
    let total = 0;
    for (const producto of productos) {
      total += producto.cantidad * producto.precioUnitario;
    }

    total += Number(precioEnvio) || 0; // ✅ Sumar el costo de envío al total

    // Insertar cotización con Total
    const result = await transaction
      .request()
      .input("IdUsuario", idUsuario)
      .input("Fecha", fechaActual)
      .input("Total", total)
      .input("NombreFinca", nombreFinca || null).query(`
        INSERT INTO Cotizaciones (IdUsuario, FechaSolicitud, Total, NombreFinca)
        OUTPUT INSERTED.IdCotizacion
        VALUES (@IdUsuario, @Fecha, @Total, @NombreFinca)
      `);

    const idCotizacion = result.recordset[0].IdCotizacion;

    // Insertar detalle de cotización
    for (const producto of productos) {
      await transaction
        .request()
        .input("IdCotizacion", idCotizacion)
        .input("IdProducto", producto.idProducto)
        .input("Cantidad", producto.cantidad)
        .input("PrecioUnitario", producto.precioUnitario)
        .query(`
          INSERT INTO DetalleCotizacion 
          (IdCotizacion, IdProducto, Cantidad, PrecioUnitario)
          VALUES (@IdCotizacion, @IdProducto, @Cantidad, @PrecioUnitario)
        `);
    }

    // Insertar pedido y obtener IdPedido
    const pedidoResult = await transaction
      .request()
      .input("Cedula", cedula)
      .input("Fecha", fechaActual)
      .input("IdCotizacion", idCotizacion).query(`
      INSERT INTO Pedidos (Cedula, FechaPedido, IdCotizacion)
      OUTPUT INSERTED.IdPedido
      VALUES (@Cedula, @Fecha, @IdCotizacion)
    `);

    const idPedido = pedidoResult.recordset[0].IdPedido;

    // Insertar detalle del pedido
    for (const producto of productos) {
      await transaction
        .request()
        .input("IdPedido", idPedido)
        .input("IdProducto", producto.idProducto)
        .input("Cantidad", producto.cantidad).query(`
          INSERT INTO DetallePedido (IdPedido, IdProducto, Cantidad)
          VALUES (@IdPedido, @IdProducto, @Cantidad)
        `);
    }

    await transaction.commit();
    return {
      idCotizacion,
      mensaje: "Cotización, pedido y sus detalles creados exitosamente",
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const obtenerCotizacionesPorCedula = async (cedula) => {
  const pool = await poolPromise;

  try {
    const result = await pool.request()
      .input('Cedula', cedula)
      .query(`
        SELECT c.IdCotizacion, c.FechaSolicitud, c.Total, c.Estado
        FROM Cotizaciones c
        JOIN Clientes cl ON c.IdUsuario = cl.IdUsuario
        WHERE cl.Cedula = @Cedula
        ORDER BY c.FechaSolicitud DESC
      `);

    const cotizaciones = [];

    for (const cotizacion of result.recordset) {
      const detalle = await pool.request()
        .input('IdCotizacion', cotizacion.IdCotizacion)
        .query(`
          SELECT dc.IdProducto, p.Nombre AS NombreProducto, dc.Cantidad, dc.PrecioUnitario AS Precio, dc.TiempoEntrega
          FROM DetalleCotizacion dc
          INNER JOIN Productos p ON dc.IdProducto = p.IdProducto
          WHERE dc.IdCotizacion = @IdCotizacion
        `);

      cotizaciones.push({
        ...cotizacion,
        Detalles: detalle.recordset
      });
    }

    return cotizaciones;
  } catch (error) {
    throw error;
  }
};


const actualizarEstadoCotizacion = async (idCotizacion, nuevoEstado) => {
  const pool = await poolPromise;
  await pool.request()
    .input('Estado', nuevoEstado)
    .input('IdCotizacion', idCotizacion)
    .query(`
      UPDATE Cotizaciones 
      SET Estado = @Estado 
      WHERE IdCotizacion = @IdCotizacion
    `);
};

const actualizarTiempoEntrega = async (idDetalle, tiempoEntrega) => {
  const pool = await poolPromise;
  await pool.request()
    .input('IdDetalle', idDetalle)
    .input('TiempoEntrega', tiempoEntrega)
    .query(`
      UPDATE DetalleCotizacion
      SET TiempoEntrega = @TiempoEntrega
      WHERE IdDetalle = @IdDetalle
    `);
};

module.exports = {
  crearCotizacion,
  obtenerCotizacionesPorCedula,
  actualizarEstadoCotizacion,
  actualizarTiempoEntrega
};
