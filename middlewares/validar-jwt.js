const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async(req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(400).json({
      msg: 'No hay token en la petición'
    })
  }

  try {

    const { uid } = jwt.verify(token, process.env.SECRETORPUBLICKEY);

    // obtiene el usuario segun el uid
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: 'Token no válido, el usuario no existe en la BD'
      })
    }

    // verifica si el uid tiene estado en true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Token no válido, el usuario esta con estado en false'
      })
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token no válio'
    })
  }
}

module.exports = {
  validarJWT
}