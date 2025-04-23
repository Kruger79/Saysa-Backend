const sql = require('mssql');

// Configuración desde el archivo .env
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false, // Cambia según tu configuración
    trustServerCertificate: true,
  },
};


// Función para conectar y devolver la conexión
const getConnection = async () => {
  try {
    const pool = await sql.connect(config);
    console.log('🔗 Conectado a SQL Server');
    return pool;
  } catch (err) {
    console.error('❌ Error de conexión a SQL Server:', err);
    throw err;
  }
};

module.exports = { getConnection };
