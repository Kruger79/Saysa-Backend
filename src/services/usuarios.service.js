const { sql, poolPromise } = require('../database/config');

// Servicio para registrar un usuario nuevo
const registrarUsuarioService = async (usuarioData) => {
  const { nombre, correo, telefono, contrasena, cedula } = usuarioData;

  try {
    const pool = await poolPromise;

    // Validar que no exista la cédula
    const validarCedula = await pool
      .request()
      .input('Cedula', sql.NVarChar, cedula)
      .query('SELECT * FROM Clientes WHERE Cedula = @Cedula');

    if (validarCedula.recordset.length > 0) {
      throw new Error('La cédula ya está registrada');
    }

    // Validar que no exista el correo
    const validarCorreo = await pool
      .request()
      .input('Correo', sql.NVarChar, correo)
      .query('SELECT * FROM Clientes WHERE Correo = @Correo');

    if (validarCorreo.recordset.length > 0) {
      throw new Error('El correo ya está registrado');
    }

    await pool
      .request()
      .input('Nombre', sql.NVarChar, nombre)
      .input('Correo', sql.NVarChar, correo)
      .input('Telefono', sql.NVarChar, telefono)
      .input('Contrasena', sql.NVarChar, contrasena)
      .input('Rol', sql.NVarChar, 'cliente')
      .input('FechaRegistro', sql.DateTime, new Date())
      .input('Cedula', sql.NVarChar, cedula)
      .query(`
        INSERT INTO Clientes (Nombre, Correo, Telefono, Contrasena, Rol, FechaRegistro, Cedula)
        VALUES (@Nombre, @Correo, @Telefono, @Contrasena, @Rol, @FechaRegistro, @Cedula)
      `);

    return { mensaje: 'Usuario registrado con éxito' };
  } catch (error) {
    console.error('❌ Error en registrarUsuarioService:', error);
    throw error;
  }
};

module.exports = {
  registrarUsuarioService
};
