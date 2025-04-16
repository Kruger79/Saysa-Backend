// src/database/test-db.js
const { sql, poolPromise } = require('./db');

async function testConnection() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT GETDATE() AS FechaActual');
    console.log('🕒 Fecha desde SQL Server:', result.recordset[0].FechaActual);
  } catch (error) {
    console.error('❌ Error al ejecutar consulta:', error);
  }
}

testConnection();
