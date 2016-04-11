var Seq = require('../../db').Seq();
/*
* The user definition model
* */
module.exports = {
  model: {
    account_id: {
      type: Seq.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    account_type: Seq.STRING,
    money_amount: Seq.DECIMAL,
    created_date: {
      type: Seq.DATE,
      allowNull: true
    }
  },
  relations: {
    'belongsTo': {
      'client': {
        foreignKey: 'client_id',
        allowNull: true
      }
    },
    'hasMany': {
      'client': {
        as: 'Clients',
        foreignKey: 'account_id',
        through: 'clients_accounts'
      }
    }
  }
};