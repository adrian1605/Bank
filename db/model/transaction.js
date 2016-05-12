/**
 * Created by adrianpogacean on 5/12/2016.
 */
var Seq = require('../../db').Seq();
/*
 * The transaction definition model
 * */
module.exports = {
    model: {
        id: {
            type: Seq.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        from: Seq.STRING,
        to: Seq.STRING,
        created_date: {
            type: Seq.DATE,
            allowNull: true
        },
        type: Seq.STRING,
        amount: Seq.DECIMAL,
    },
    relations: {
        'belongsTo': {
            'user': {
                foreignKey: 'user_id'
            }
        }
    }
};