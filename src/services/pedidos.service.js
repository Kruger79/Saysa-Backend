// src/services/pedidos.service.js
const { poolPromise } = require('../database/config');

const guardarPedidoService = async (cedula, productos) => {
  const pool = await poolPromise;
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    // Insertar en tabla Pedidos
    const pedidoResult = await transaction.request()
      .input('Cedula', cedula)
      .query(`
        INSERT INTO Pedidos (Cedula, FechaPedido)
        OUTPUT INSERTED.IdPedido
        VALUES (@Cedula, GETDATE())
      `);

    const pedidoId = pedidoResult.recordset[0].IdPedido;

    // Insertar detalles del pedido
    for (const producto of productos) {
      await transaction.request()
        .input('IdPedido', pedidoId)
        .input('IdProducto', producto.idProducto)
        .input('Cantidad', producto.cantidad || 1)
        .query(`
          INSERT INTO DetallePedido (IdPedido, IdProducto, Cantidad)
          VALUES (@IdPedido, @IdProducto, @Cantidad)
        `);
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const obtenerPedidosPorCedulaService = async (cedula) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('Cedula', cedula)
    .query(`
      SELECT p.IdPedido, p.FechaPedido, dp.Cantidad, pr.Nombre, pr.Precio, pr.ImagenUrl
      FROM Pedidos p
      INNER JOIN DetallePedido dp ON p.IdPedido = dp.IdPedido
      INNER JOIN Productos pr ON dp.IdProducto = pr.IdProducto
      WHERE p.Cedula = @Cedula
      ORDER BY p.FechaPedido DESC
    `);

  return result.recordset;
};

module.exports = {
  guardarPedidoService,
  obtenerPedidosPorCedulaService,
};
