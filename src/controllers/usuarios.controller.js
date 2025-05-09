const { registrarUsuarioService, loginUsuarioService, actualizarTelefonoService, obtenerUsuariosService, actualizarRolUsuarioService } = require('../services/usuarios.service');

// Controlador para registrar usuario
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, telefono, contrasena, cedula } = req.body;

    await registrarUsuarioService({ nombre, correo, telefono, contrasena, cedula });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ error: error.message || 'Error al registrar usuario' });
  }
};

// Controlador para login
const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const usuario = await loginUsuarioService(correo, contrasena);

    res.status(200).json(usuario);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Controlador para obtener usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await obtenerUsuariosService();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controlador para actualizar teléfono
const actualizarTelefono = async (req, res) => {
  try {
    const { cedula } = req.params;
    const { telefono } = req.body;

    await actualizarTelefonoService(cedula, telefono);

    res.status(200).json({ mensaje: 'Teléfono actualizado exitosamente' });
  } catch (error) {
    console.error('❌ Error al actualizar teléfono:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controlador para actualizar solo el rol
const actualizarRolUsuario = async (req, res) => {
  try {
    const { cedula } = req.params;
    const { rol } = req.body;
    await actualizarRolUsuarioService(cedula, rol);
    res.status(200).json({ mensaje: 'Rol actualizado exitosamente' });
  } catch (error) {
    console.error('❌ Error al actualizar rol:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  registrarUsuario,
  loginUsuario,
  actualizarTelefono,
  obtenerUsuarios,
  actualizarRolUsuario
 };
