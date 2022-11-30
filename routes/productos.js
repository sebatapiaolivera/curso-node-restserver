const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductosPorId, obtenerProductos, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

router.get('/', obtenerProductos);

router.get('/:id', [
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id').custom(existeProductoPorId),
  validarCampos
], obtenerProductosPorId);

router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio'),
  check('categoria', 'No es un id de mongo válido').isMongoId(),
  check('categoria').custom(existeCategoriaPorId),
  validarCampos
], crearProducto);

router.put('/:id', [
  validarJWT,
  check('id').custom(existeProductoPorId),
  validarCampos
], actualizarProducto);

router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un id de mongo válido').isMongoId(),
  check('id').custom(existeProductoPorId),
  validarCampos
], borrarProducto);

module.exports = router;