require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Conectado a SQL Server');
    }
    return pool;
  })
  .catch(err => {
    console.error('❌ Error de conexión a SQL Server:', err);
    throw err;
  });


module.exports = {
  sql,
  poolPromise
};
