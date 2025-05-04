const { poolPromise } = require('../database/config');

const obtenerProductosService = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM Productos WHERE Activo = 1');
  return result.recordset;
};

const getProductoById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('IdProducto', id)
    .query('SELECT * FROM Productos WHERE IdProducto = @IdProducto AND Activo = 1');
  return result.recordset[0];
};

const createProducto = async (producto) => {
  const { Nombre, Descripcion, ImagenUrl, Precio } = producto;
  const pool = await poolPromise;
  await pool.request()
    .input('Nombre', Nombre)
    .input('Descripcion', Descripcion)
    .input('ImagenUrl', ImagenUrl)
    .input('Precio', Precio)
    .input('FechaCreacion', new Date())
    .query(`
      INSERT INTO Productos (Nombre, Descripcion, ImagenUrl, Precio, Activo, FechaCreacion)
      VALUES (@Nombre, @Descripcion, @ImagenUrl, @Precio, 1, @FechaCreacion)
    `);
};

const updateProducto = async (id, producto) => {
  const { Nombre, Descripcion, ImagenUrl, Precio } = producto;
  const pool = await poolPromise;
  await pool.request()
    .input('IdProducto', id)
    .input('Nombre', Nombre)
    .input('Descripcion', Descripcion)
    .input('ImagenUrl', ImagenUrl)
    .input('Precio', Precio)
    .query(`
      UPDATE Productos
      SET Nombre = @Nombre,
          Descripcion = @Descripcion,
          ImagenUrl = @ImagenUrl,
          Precio = @Precio
      WHERE IdProducto = @IdProducto AND Activo = 1
    `);
};

const deleteProducto = async (id) => {
  const pool = await poolPromise;
  await pool.request()
    .input('IdProducto', id)
    .query('UPDATE Productos SET Activo = 0 WHERE IdProducto = @IdProducto');
};

module.exports = {
  obtenerProductosService,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};