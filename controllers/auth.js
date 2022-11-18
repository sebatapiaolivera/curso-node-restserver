const { response } = require('express');
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res = response) => {

  const { correo, password } = req.body;

  try {

    //verificar si el correo existe
    const usuario  = await Usuario.findOne({correo});
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos.'
      });
    }

    //verificar si el usuaruo esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'El usuario no esta activo en la BD.'
      });
    }
    //verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos.'
      });
    }

    //generar jwt
    const token = await generarJWT(usuario.id);


    res.json({
      usuario,
      token
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con sebita!'
    });
  }
};

module.exports = {
  login
}