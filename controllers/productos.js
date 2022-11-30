const { response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async(req, res = response) => {
  const { desde = 0, limite = 5} = req.query;
  const query = { estado: true};

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate('usuario', ['nombre', 'correo'])
      .populate('categoria')
      .skip(Number(desde))
      .limit(Number(limite))
  ]);

  res.json({
    total,
    productos
  })
}

const obtenerProductosPorId = async(req, res = response) => {
  const { id } = req.query;
  const producto = Producto.findById(id)
    .populate('usuario')
    .populate('categoria');

  res.json(producto);
}

const crearProducto = async(req, res = response) => {
  const { estado, usuario, ...body } = req.body;

  //verificar que no exista el producto con las mismas caracteristicas
  const productoBD = await Producto.findOne({nombre: body.nombre.toUpperCase()});

  if (productoBD) {
    return res.status(400).json({
      msg: `El producto ${productoBD.nombre} ya existe en la BD.`
    })
  }

  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id
  };

  const producto = new Producto(data);

  //guardar db
  await producto.save();

  res.status(201).json(producto);
}

const actualizarProducto = async(req, res = response) => {
  console.log('valor request', req);
  const { id } = req.params;

  const { estado, usuario, ...data } = req.body;

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json(producto);
}

const borrarProducto = async(req, res = response) => {
  const { id } = req.params;
  const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

  res.json(productoBorrado);
}

module.exports = {
  obtenerProductos,
  obtenerProductosPorId,
  crearProducto,
  actualizarProducto,
  borrarProducto
}