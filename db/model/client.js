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
    name: Seq.STRING,
    id_card_number: Seq.STRING,
    cnp: Seq.STRING,
    address: {
      type: Seq.STRING,
      allowNull: true
    },
    phone: {
      type: Seq.STRING,
      allowNull: true
    },
    email: {
      type: Seq.STRING,
      allowNull: true
    }
  },
  relations: {
    'hasMany': {
      'account': {
        foreignKey: 'account_id',
        through: 'clients_accounts',
        as: 'Accounts'
      }
    }
  }
};