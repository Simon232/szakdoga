module.exports = {
    identity: 'user',
    connection: 'default',
    attributes: {
        username: {
            type: 'string',
            required: true
        },
        friendlist: {
            type: [],
            required: false
        },
        highscore: {
            type: 'int',
            required: false
        },
        date: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true
        }
    }
};