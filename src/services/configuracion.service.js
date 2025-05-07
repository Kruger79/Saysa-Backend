const { poolPromise } = require('../database/config');

const obtenerPrecioEnvio = async () => {
  const pool = await poolPromise;
  const result = await pool.request()
    .query("SELECT Valor FROM Configuracion WHERE Clave = 'CostoEnvio'");
  return parseFloat(result.recordset[0]?.Valor || 0);
};

const actualizarPrecioEnvio = async (nuevoValor) => {
  const pool = await poolPromise;
  await pool.request()
    .input('Valor', nuevoValor.toString())
    .query("UPDATE Configuracion SET Valor = @Valor WHERE Clave = 'CostoEnvio'");
};

module.exports = {
  obtenerPrecioEnvio,
  actualizarPrecioEnvio
};
