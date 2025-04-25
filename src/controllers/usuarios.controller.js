const { registrarUsuarioService, loginUsuarioService } = require('../services/usuarios.service');

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

module.exports = { 
  registrarUsuario,
  loginUsuario
 };
