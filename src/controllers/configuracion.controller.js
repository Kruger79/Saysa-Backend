const {
    obtenerPrecioEnvio,
    actualizarPrecioEnvio
  } = require('../services/configuracion.service');
  
  const getPrecioEnvio = async (req, res) => {
    try {
      const valor = await obtenerPrecioEnvio();
      res.json({ precioEnvio: valor });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener el precio de envío', error });
    }
  };
  
  const putPrecioEnvio = async (req, res) => {
    const { valor } = req.body;
  
    if (isNaN(valor) || valor < 0) {
      return res.status(400).json({ mensaje: 'El precio debe ser un número positivo' });
    }
  
    try {
      await actualizarPrecioEnvio(valor);
      res.json({ mensaje: 'Precio de envío actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar el precio de envío', error });
    }
  };
  
  module.exports = {
    getPrecioEnvio,
    putPrecioEnvio
  };
  