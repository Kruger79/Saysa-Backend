const express = require("express")
const router = express.Router();
const { poolPromise } = require("../../database/config");

router
    .route("/")
    .get((req, res) => {
        res.send(`<h1>Hola desde ${req.baseUrl}<h1>`);
    });

// Ruta de prueba de conexión a la BD
router.route("/test-db").get(async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query("SELECT GETDATE() AS now");
      res.json({
        message: "✅ Conexión exitosa a SQL Server",
        now: result.recordset[0].now,
      });
    } catch (error) {
      res.status(500).json({
        error: "❌ Error al conectar con la base de datos",
        detalles: error.message,
      });
    }
  });

module.exports = router;