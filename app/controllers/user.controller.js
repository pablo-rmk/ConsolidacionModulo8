//const { Bootcamp, User } = require('../models');
const db = require('../models');
const Bootcamp = db.bootcamps;
const User = db.users;
const jwt = require('jsonwebtoken');
const keys = require('../config/keys')

// Crear y guardar un nuevo usuario
exports.createUser = (req, res) => {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  User.create(user)
    .then((user) => {
      console.log(`>> Creado el usuario: ${JSON.stringify(user, null, 4)}`);
      res.status(201).json(user);
    })
    .catch((err) => {
      console.log(`>> Error al crear el usuario: ${err}`);
      res.status(500).json({ message: 'Error al crear el usuario' });
    });
};

// Obtener un usuario por ID
exports.findUserById = (req, res) => {
  const Id = req.params.id;

  User.findByPk(Id, {
    include: [
      {
        model: Bootcamp,
        as: 'bootcamps',
        attributes: ['id', 'title', 'cue', 'description'],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((user) => {
      if (!user) {
        console.log(`Usuario con id=${Id} no encontrado`);
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(`>> Error mientras se encontraba el usuario: ${err}`);
      res.status(500).json({ message: 'Error mientras se encontraba el usuario' });
    });
};

// Obtener todos los usuarios incluyendo los Bootcamp
exports.findAll = (req, res) => {
  User.findAll({
    include: [
      {
        model: Bootcamp,
        as: 'bootcamps',
        attributes: ['id', 'title', 'cue', 'description'],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log('>> Error buscando los usuarios: ', err);
      res.status(500).json({ message: 'Error buscando los usuarios' });
    });
};

// Actualizar un usuario por ID
exports.updateUserById = (req, res) => {
  const Id = req.params.id;
  const { firstName, lastName } = req.body;

  User.update(
    { firstName, lastName },
    {
      where: { id: Id },
    }
  )
    .then((num) => {
      if (num[0] === 1) {
        console.log(`Usuario con id=${Id} actualizado`);
        res.status(200).json({ message: 'Usuario actualizado correctamente' });
      } else {
        console.log(`Usuario con id=${Id} no encontrado`);
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    })
    .catch((err) => {
      console.log(`>> Error mientras se actualizaba el usuario: ${err}`);
      res.status(500).json({ message: 'Error mientras se actualizaba el usuario' });
    });
};

// Eliminar un usuario por ID
exports.deleteUserById = (req, res) => {
  const Id = req.params.id;

  User.destroy({
    where: { id: Id },
  })
    .then((num) => {
      if (num === 1) {
        console.log(`Usuario con id=${Id} eliminado`);
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
      } else {
        console.log(`Usuario con id=${Id} no encontrado`);
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    })
    .catch((err) => {
      console.log(`>> Error mientras se eliminaba el usuario: ${err}`);
      res.status(500).json({ message: 'Error mientras se eliminaba el usuario' });
    });
};

//Iniciar sesion, user = admin, pass= 12345
exports.login = (req, res) => {
  
  if (req.body.user === 'admin' && req.body.pass === '12345') {
    const payload = {
      check: true
    };
    const token = jwt.sign(payload, keys.key, {
      expiresIn: '30m'
    });
    res.json({
      message: 'Autenticación exitosa',
      token: token
    });
  } else {
    res.json({
      message: 'Usuario y/o password incorrectos'
    });
  };
};


