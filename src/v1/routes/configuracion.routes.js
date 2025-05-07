const express = require('express');
const router = express.Router();

const {
  getPrecioEnvio,
  putPrecioEnvio
} = require('../../controllers/configuracion.controller');

router.get('/precio-envio', getPrecioEnvio);
router.put('/precio-envio', putPrecioEnvio);

module.exports = router;