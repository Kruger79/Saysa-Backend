const sql = require('mssql');
const db = require('../database/config');

// Servicio para registrar usuario
const registrarUsuarioService = async ({ nombre, correo, telefono, contrasena, cedula }) => {
  try {
    const pool = await db.getConnection();

    // Verificar si la cédula ya existe
    const cedulaExistente = await pool.request()
      .input('Cedula', sql.NVarChar, cedula)
      .query('SELECT 1 FROM Clientes WHERE Cedula = @Cedula');

    if (cedulaExistente.recordset.length > 0) {
      throw new Error('La cédula ya está registrada');
    }

    // Insertar en la base de datos
    await pool.request()
      .input('Nombre', sql.NVarChar, nombre)
      .input('Correo', sql.NVarChar, correo)
      .input('Telefono', sql.NVarChar, telefono)
      .input('Contrasena', sql.NVarChar, contrasena)
      .input('Cedula', sql.NVarChar, cedula)
      .query(`INSERT INTO Clientes (Nombre, Correo, Telefono, Contrasena, Cedula)
              VALUES (@Nombre, @Correo, @Telefono, @Contrasena, @Cedula)`);

  } catch (error) {
    console.error('❌ Error en registrarUsuarioService:', error);
    throw error;
  }
};

module.exports = { registrarUsuarioService };