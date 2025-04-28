const { sql, poolPromise } = require('../database/config');
const bcrypt = require('bcrypt');

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

    // 🔐 Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    await pool
      .request()
      .input('Nombre', sql.NVarChar, nombre)
      .input('Correo', sql.NVarChar, correo)
      .input('Telefono', sql.NVarChar, telefono)
      .input('Contrasena', sql.NVarChar, hashedPassword)
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

// Servicio para obtener todos los usuarios
const obtenerUsuariosService = async () => {
  try {
    const pool = await poolPromise;
    const resultado = await pool.request().query('SELECT IdUsuario, Nombre, Correo, Telefono, Rol, Cedula FROM Clientes');
    return resultado.recordset;
  } catch (error) {
    console.error('❌ Error en obtenerUsuariosService:', error);
    throw error;
  }
};

// Servicio para verificar login de usuario
const loginUsuarioService = async (correoOCedula, contrasena) => {
  try {
    const pool = await poolPromise;

    const resultado = await pool
      .request()
      .input('Identificador', sql.NVarChar, correoOCedula)
      .query(`
        SELECT * FROM Clientes
        WHERE Correo = @Identificador OR Cedula = @Identificador
      `);

    const usuario = resultado.recordset[0];

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const contraseñaValida = await bcrypt.compare(contrasena, usuario.Contrasena);

    if (!contraseñaValida) {
      throw new Error('Contraseña incorrecta');
    }

    delete usuario.Contrasena;
    return usuario;
  } catch (error) {
    console.error('❌ Error en loginUsuarioService:', error);
    throw error;
  }
};

// Servicio para actualizar solo el rol de un usuario basado en la Cédula
const actualizarRolUsuarioService = async (cedula, rol) => {
  try {
    const pool = await poolPromise;
    const resultado = await pool
      .request()
      .input('Cedula', sql.NVarChar, cedula)
      .input('Rol', sql.NVarChar, rol)
      .query('UPDATE Clientes SET Rol = @Rol WHERE Cedula = @Cedula');

    if (resultado.rowsAffected[0] === 0) {
      throw new Error('No se encontró un usuario con esa cédula.');
    }
  } catch (error) {
    console.error('❌ Error en actualizarRolUsuarioService:', error);
    throw error;
  }
};

// Servicio para actualizar teléfono
const actualizarTelefonoService = async (cedula, telefono) => {
  try {
    const pool = await poolPromise;

    await pool
      .request()
      .input('Cedula', sql.NVarChar, cedula)
      .input('Telefono', sql.NVarChar, telefono)
      .query('UPDATE Clientes SET Telefono = @Telefono WHERE Cedula = @Cedula');
    
  } catch (error) {
    console.error('❌ Error en actualizarTelefonoService:', error);
    throw error;
  }
};

module.exports = {
  registrarUsuarioService,
  loginUsuarioService,
  actualizarTelefonoService,
  obtenerUsuariosService,
  actualizarRolUsuarioService
};
