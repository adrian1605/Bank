var Seq = require('../../db').Seq();
/*
 * The user definition model
 * */
module.exports = {
  model: {
    id: {
      type: Seq.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Seq.STRING,
      allowNull: false
    },
    password: {
      type: Seq.STRING,
      allowNull: false
    },
    is_admin: Seq.BOOLEAN,
    first_name: {
      type: Seq.STRING,
      allowNull: true
    },
    last_name: {
      type: Seq.STRING,
      allowNull: true
    },
    birth_date: {
      type: Seq.DATE,
      allowNull: true
    },
    phone: {
      type: Seq.STRING,
      allowNull: true
    },
    email: {
      type: Seq.STRING,
      allowNull: true
    },
    avatar: {
      type: Seq.STRING,
      allowNull: true
    }
  }
};