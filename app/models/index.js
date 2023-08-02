const dbConfig = require('../config/db.config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.users = require('./user.model')(sequelize, Sequelize);
db.bootcamps = require('./bootcamp.model')(sequelize, Sequelize);

db.users.belongsToMany(db.bootcamps, {
  through: "user_bootcamp",
  as: "bootcamps",
  foreignKey: "user_id",
});

db.bootcamps.belongsToMany(db.users, {
  through: "user_bootcamp",
  as: "users",
  foreignKey: "bootcamp_id",
});

db.sequelize.sync({ force: true }).then(async () => {
  console.log('\nEliminando y resincronizando la base de datos.\n');

  try {
    const users = await db.users.bulkCreate([
      {
        firstName: 'Mateo',
        lastName: 'Díaz',
        email: 'mateo.diaz@correo.com',
      },
      {
        firstName: 'Santiago',
        lastName: 'Mejias',
        email: 'santiago.mejias@correo.com',
      },
      {
        firstName: 'Facundo',
        lastName: 'Fernández',
        email: 'facundo.fernandez@correo.com',
      },
      {
        firstName: 'Lucas',
        lastName: 'Rojas',
        email: 'lucas.rojas@correo.com',
      },
    ]);

    console.log('\nLos usuarios se agregaron a la tabla exitosamente.\n');
    users.forEach(element => {
      console.log(element.dataValues);
    });

    const bootcamps = await db.bootcamps.bulkCreate([
      {
        title: 'Introduciendo El Bootcamp De React',
        cue: 10,
        description: "React es la librería más usada en JavaScript para el desarrollo de interfaces",
      },
      {
        title: 'Bootcamp Desarrollo Web Full Stack',
        cue: 12,
        description: "Crearás aplicaciones web utilizando las tecnologías y lenguajes más actuales y populares como JavaScript, nodeJS, Angular, MongoDB, ExpressJS",
      },
      {
        title: 'Bootcamp Big Data, Inteligencia Artificial & Machine Learning',
        cue: 12,
        description: "Domina Data Science todo el ecosistema de lenguajes y herramientas de Big Data e intégralos con modelos avanzados de Artificial Intelligence y Machine Learning",
      },
    ]);

    console.log('\nLos bootcamps se agregaron a la tabla exitosamente.\n');
    bootcamps.forEach(element => {
      console.log(element.dataValues);
    });

    const user1 = users[0];
    const user2 = users[1];
    const user3 = users[2];
    const user4 = users[3];

    const bootcamp1 = bootcamps[0];
    const bootcamp2 = bootcamps[1];
    const bootcamp3 = bootcamps[2];

    await bootcamp1.addUser(user1);
    await bootcamp1.addUser(user2);
    await bootcamp2.addUser(user1);
    await bootcamp3.addUsers([user1, user2, user3, user4]);

    console.log('\nUsuarios agregados a los bootcamps con éxito.\n');
  } catch (error) {
    console.error(error.stack);
  }
});

module.exports = db;
