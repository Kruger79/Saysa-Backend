const { registrarUsuarioService } = require('../services/usuarios.service');

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

module.exports = { registrarUsuario };
