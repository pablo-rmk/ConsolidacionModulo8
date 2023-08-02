module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'El Campo del nombre es requerido',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'El Campo del apellido es requerido',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'El correo electrónico es requerido',
        },
        isEmail: {
          args: true,
          msg: 'Formato de correo electrónico inválido',
        },
      },
      unique: {
        args: true,
        msg: 'Correo electrónico actualmente registrado en la base de datos',
      },
    },
  });

  return User;
};
