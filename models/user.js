module.exports = {
    identity: 'user',
    connection: 'default',
    attributes: {
        username: {
            type: 'string',
            unique: true,
            required: true
        },
        // friendlist: {
        //     type: "[]",
        //     required: false
        // },
        highscore: {
            type: 'number',
            required: false
        },
        date: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true
        }
    }
};