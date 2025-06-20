const { poolPromise } = require("../database/config");

const obtenerPedidosPorCedula = async (cedula) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input("Cedula", cedula).query(`
        SELECT 
          p.IdPedido, 
          p.FechaPedido, 
          d.Cantidad, 
          pr.Nombre, 
          pr.Precio, 
          pr.ImagenUrl
        FROM Pedidos p
        INNER JOIN DetallePedido d ON p.IdPedido = d.IdPedido
        INNER JOIN Productos pr ON d.IdProducto = pr.IdProducto
        WHERE p.Cedula = @Cedula
        ORDER BY p.FechaPedido DESC
      `);
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

const obtenerTodosLosPedidos = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.query(`
      SELECT 
  p.IdPedido, 
  p.FechaPedido, 
  c.Nombre AS NombreCliente, 
  c.Cedula,
  p.IdCotizacion,
  co.Estado,

  dc.IdDetalle,
  dc.TiempoEntrega

FROM Pedidos p
INNER JOIN Clientes c ON p.Cedula = c.Cedula
LEFT JOIN Cotizaciones co ON co.IdCotizacion = p.IdCotizacion
OUTER APPLY (
  SELECT TOP 1 dc.IdDetalle, dc.TiempoEntrega
  FROM DetalleCotizacion dc
  WHERE dc.IdCotizacion = co.IdCotizacion
  ORDER BY dc.IdDetalle ASC
) dc

ORDER BY p.FechaPedido DESC;

    `);
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  obtenerPedidosPorCedula,
  obtenerTodosLosPedidos,
};
