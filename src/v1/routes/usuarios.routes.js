const express = require('express'); // Importa Express
const router = express.Router();    // Crea un nuevo router
const usuariosController = require('../../controllers/usuarios.controller'); // Importa el controlador

// Ruta POST para registrar usuario
router.post('/', usuariosController.registrarUsuario);
router.post('/login', usuariosController.loginUsuario);
// Nuevo endpoint para actualizar teléfono
router.put('/:cedula', usuariosController.actualizarTelefono);

// Obtener usuarios
router.get('/', usuariosController.obtenerUsuarios);

// Actualizar rol
router.put('/:cedula/rol', usuariosController.actualizarRolUsuario);

module.exports = router;
