const db = require('../models');
const Bootcamp = db.bootcamps;
const User = db.users;

// Crear y guardar un nuevo bootcamp
exports.createBootcamp = (req, res) => {
  const bootcamp = {
    title: req.body.title,
    cue: req.body.cue,
    description: req.body.description,
  };

  Bootcamp.create(bootcamp)
    .then((bootcamp) => {
      console.log(`>> Creado el bootcamp: ${JSON.stringify(bootcamp, null, 4)}`);
      res.status(201).json(bootcamp);
    })
    .catch((err) => {
      console.log(`>> Error al crear el bootcamp: ${err}`);
      res.status(500).json({ message: 'Error al crear el bootcamp' });
    });
};

// Agregar un Usuario al Bootcamp
exports.addUser = (req, res) => {
  const bootcampId = req.params.bootcampId;
  const userId = req.params.userId;

  Bootcamp.findByPk(bootcampId)
    .then((bootcamp) => {
      if (!bootcamp) {
        console.log('No se encontró el Bootcamp!');
        return res.status(404).json({ message: 'No se encontró el Bootcamp' });
      }

      User.findByPk(userId).then((user) => {
        if (!user) {
          console.log('Usuario no encontrado!');
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        bootcamp.addUser(user);
        console.log(`Agregado el usuario id=${user.id} al bootcamp con id=${bootcamp.id}`);
        res.status(200).json(bootcamp);
      });
    })
    .catch((err) => {
      console.log('>> Error mientras se estaba agregando Usuario al Bootcamp', err);
      res.status(500).json({ message: 'Error mientras se estaba agregando Usuario al Bootcamp' });
    });
};

// obtener los bootcamp por id
exports.findById = (req, res) => {
  const Id = req.params.id;

  Bootcamp.findByPk(Id, {
    include: [
      {
        model: User,
        as: 'users',
        attributes: ['id', 'firstName', 'lastName'],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((bootcamp) => {
      if (!bootcamp) {
        console.log(`Bootcamp con id=${Id} no encontrado`);
        return res.status(404).json({ message: 'Bootcamp no encontrado' });
      }

      res.status(200).json(bootcamp);
    })
    .catch((err) => {
      console.log(`>> Error mientras se encontraba el bootcamp: ${err}`);
      res.status(500).json({ message: 'Error mientras se encontraba el bootcamp' });
    });
};

// obtener todos los Usuarios incluyendo los Bootcamp
exports.findAll = (req, res) => {
  Bootcamp.findAll({
    include: [
      {
        model: User,
        as: 'users',
        attributes: ['id', 'firstName', 'lastName'],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((bootcamps) => {
      res.status(200).json(bootcamps);
    })
    .catch((err) => {
      console.log('>> Error buscando los Bootcamps: ', err);
      res.status(500).json({ message: 'Error buscando los Bootcamps' });
    });
};