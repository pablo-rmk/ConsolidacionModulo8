const express = require('express');
const router = express.Router();
const bootcampController = require('../controllers/bootcamp.controller');
const userController = require('../controllers/user.controller');
const verificacion = require('../middleware/login')

// Crear un nuevo bootcamp
router.post('/bootcamps', verificacion, bootcampController.createBootcamp);

// Agregar un usuario a un bootcamp
router.post('/bootcamps/:bootcampId/users/:userId', bootcampController.addUser);

// Obtener un bootcamp por ID
router.get('/bootcamps/:id', verificacion, bootcampController.findById);

// Obtener todos los bootcamps con usuarios
router.get('/bootcamps', verificacion, bootcampController.findAll);

// Crear un nuevo usuario
router.post('/users', verificacion, userController.createUser);

// Obtener un usuario por ID
router.get('/users/:id', verificacion, userController.findUserById);

// Obtener todos los usuarios con bootcamps
router.get('/users', verificacion, userController.findAll);

// Actualizar un usuario por ID
router.put('/users/:id', verificacion, userController.updateUserById);

// Eliminar un usuario por ID
router.delete('/users/:id', verificacion, userController.deleteUserById);

//Login
router.post('/login', userController.login)

module.exports = router;