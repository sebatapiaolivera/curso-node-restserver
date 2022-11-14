
const { Router } = require('express');
const { check} = require('express-validator');
const Role = require('../models/role')

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router();


router.get('/', usuariosGet );

router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  check('rol').custom(esRolValido),
  validarCampos
] ,usuariosPut );

router.post('/', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe tener un largo mínimo de 6').isLength({ min:6 }),
  check('rol').custom(esRolValido),
  check('correo', 'El correo no es válido').isEmail(),
  check('correo').custom(emailExiste),
  validarCampos
] ,usuariosPost );

router.delete('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;