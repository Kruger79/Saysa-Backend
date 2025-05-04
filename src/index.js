const express = require('express'); // Importa Express
const app = express();              // Crea la aplicación
const cors = require('cors');

require('dotenv').config();         // Carga las variables desde el archivo .env

// Middlewares
app.use(express.json()); // Permite recibir y procesar JSON en las solicitudes
app.use(cors());// ✅ Habilitar CORS
// ======================
// RUTAS
// ======================

// Ruta: Productos
const productosRoutes = require('./v1/routes/productos.routes');
app.use('/api/v1/productos', productosRoutes);

// Ruta: Usuarios
const usuariosRoutes = require('./v1/routes/usuarios.routes');
app.use('/api/v1/usuarios', usuariosRoutes);

//Ruta: Pedidos
const pedidosRoutes = require('./v1/routes/pedidos.routes');
app.use('/api/v1/pedidos', pedidosRoutes);

//Ruta: Cotizaciones
const cotizacionesRoutes = require('./v1/routes/cotizaciones.routes');
app.use('/api/v1/cotizaciones', cotizacionesRoutes);

// Ruta: 



// ======================
// INICIAR SERVIDOR
// ======================

// Toma el puerto del archivo .env o usa el 3000 por defecto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server escuchando en el puerto ${PORT}`);
});


