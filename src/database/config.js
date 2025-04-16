// db.js
const sql = require('mssql');

// Configuración de conexión
const config = {
  user: 'TU_USUARIO_SQL',         // por ejemplo: sa
  password: 'TU_CONTRASEÑA_SQL',
  server: 'localhost',            // o el nombre del servidor
  database: 'Proyecto_SaysaDB',
  options: {
    encrypt: false,               // Cambiar a true si usás Azure
    trustServerCertificate: true  // Importante para localhost
  }
};

// Exportar la conexión
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('🔗 Conectado a SQL Server');
    return pool;
  })
  .catch(err => console.error('❌ Error de conexión: ', err));

module.exports = {
  sql, poolPromise
};
