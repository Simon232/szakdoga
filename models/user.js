var bcrypt = require('bcryptjs');

module.exports = {
    identity: 'user',
    connection: 'default',
    attributes: {
        username: {
            type: 'String',
            required: true,
            unique: true
        },
        //friendlist: {
        //    type: [],
        //    required: false
        //},
        highscore: {
            type: 'integer',
            required: false,
            defaultsTo: 0
        },
        date: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true
        },
        validPassword: function (password) {
            return bcrypt.compareSync(password, this.password);
        }
    },
    beforeCreate: function(values, next) {
        bcrypt.hash(values.password, 10, function(err, hash) {
            if (err) {
                return next(err);
            }
            values.password = hash;
            next();
        });
    }

};