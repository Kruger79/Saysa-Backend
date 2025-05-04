const productoService  = require('../services/productos.service');

// Obtener todos los productos activos
const obtenerProductos = async (req, res) => {
  try {
    const productos = await productoService.obtenerProductosService();
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Obtener un producto por ID
const getProductoById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const producto = await productoService.getProductoById(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};

// Crear un nuevo producto
const createProducto = async (req, res) => {
  try {
    await productoService.createProducto(req.body);
    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

// Actualizar un producto existente
const updateProducto = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await productoService.updateProducto(id, req.body);
    res.status(200).json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

// Eliminar (desactivar) un producto
const deleteProducto = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await productoService.deleteProducto(id);
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};

module.exports = {
  obtenerProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};
