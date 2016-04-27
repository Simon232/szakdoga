
var express = require('express');

//*** server's stuffs start ***
//var router = express.Router();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
//*** server's stuffs end ***


//*** front-end's stuffs start ***
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');




var Waterline = require('waterline');
var waterlineConfig = require('./configs/waterline');
var userCollection = require('./models/user.js');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//passport
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// Local Strategy for sign-up
passport.use('registration', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {
        req.app.models.user.findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, false, {message: 'Létező username.'});
            }
            req.app.models.user.create(req.body)
                .then(function (user) {
                    return done(null, user);
                })
                .catch(function (err) {
                    return done(null, false, {message: err.details});
                })
        });
    }
));

// strategy for log-in
passport.use('login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {
        req.app.models.user.findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user || !user.validPassword(password)) {
                return done(null, false, {message: 'Helytelen adatok.'});
            }
            return done(null, user);
        });
    }
));


//*** front-end's stuffs end ***




//*** game logic's stuffs start ***
var joinedUsers = 0;
var roomManager = {};
var roomSize = -1;
var cubes = {};
var roomMessages = {};
var gameWidth = 100;
var coinPositions = {};
var trapPositions = {};
var coinNumber = 10;
var trapNumber = 4;
var cubeHalf = 0.49;
//*** game logic's stuffs end ***

//** endpoints start
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(session({
    cookie: {maxAge: 60000},
    secret: 'titkos szoveg',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

//Passport middlewares
app.use(passport.initialize());

//Session esetén (opcionális)
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.notLoggedIn = !req.isAuthenticated();
    res.locals.user = req.user;
    next();
});

//app.use(function() {
//    return function (req, res, next) {
//        res.locals.loggedIn = req.isAuthenticated();
//        res.locals.user = req.user;
//        next();
//    }
//});

app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
    //res.sendFile(__dirname + '/index.html');
    res.render('index');
});
app.get('/game', function (req, res) {
    //res.sendFile(__dirname + '/public/html/game.html');
    res.render('game');

});
app.get('/registration', function (req, res) {
    //res.sendFile(__dirname + '/public/html/registration.html') ;

    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop(); //req.flash() tömböt ad vissza


    //var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    //var data = (req.flash('data') || [{}]).pop(); //req.flash() t�mb�t ad vissza
    //console.log(req.flash('error'));
    console.log(req);

    res.render('registration', {
        //validationErrors: validationErrors,
        validationErrors: req.flash('error')
        //data: data
    });
});
//app.post('/registration', function (req, res) {
//    req.checkBody('username', 'Hibas felhasznalonev').notEmpty().withMessage('Kotelezo megadni!');
//    req.checkBody('email', ' Hibas email').notEmpty().withMessage('Kotelezo megadni!');
//    req.checkBody('password', ' Hibas jelszo').notEmpty().withMessage('Kotelezo megadni!');
//    req.checkBody('passwordagain', 'hibas jelszo').notEmpty().withMessage('Kotelezo megadni!');
//    var emailIsCorrect = validateEmail(req.checkBody('email').value);
//    var passwordsAreMatching = req.checkBody('password').value == req.checkBody('passwordagain').value;
//
//    var validationErrors = (req.validationErrors(true));// || !emailIsCorrect || !passwordsAreMatching);
//    console.log(validationErrors);
//    console.log(req.body);
//
//    if (validationErrors) {
//        console.log("hiba");
//        req.flash('validationErrors', validationErrors);
//        req.flash('data', req.body);
//        res.redirect('/registration');
//    } else {
//        if (!emailIsCorrect || !passwordsAreMatching) {
//            if (!emailIsCorrect) {
//                req.flash('validationErrors', {
//                    email: {
//                        param: 'password',
//                        msg: 'Az email cim nem megfelelo',
//                        value: req.checkBody('password').value
//                    }
//                });
//                req.flash('data', {
//                    username: req.checkBody('username').value,
//                    email: req.checkBody('email').value,
//                    password: req.checkBody('password').value,
//                    passwordagain: req.checkBody('passwordagain').value
//                });
//                res.redirect('registration');
//            }
//            if (!passwordsAreMatching) {
//                req.flash('validationErrors', {
//                    password: {
//                        param: 'password',
//                        msg: 'A jelszavak nem egyeznek',
//                        value: req.checkBody('password').value
//                    },
//                    passwordagain: {
//                        param: 'passwordagain',
//                        msg: 'A jelszavak nem egyeznek',
//                        value: req.checkBody('passwordagain').value
//                    }
//                });
//                req.flash('data', {
//                    username: req.checkBody('username').value,
//                    email: req.checkBody('email').value,
//                    password: req.checkBody('password').value,
//                    passwordagain: req.checkBody('passwordagain').value
//                });
//                res.redirect('registration');
//            }
//        } else {
//            console.log("nincs hiba");
//            res.redirect('/');
//        }
//    }
//});

app.post('/registration', passport.authenticate('registration', {

    successRedirect:    '/',
    failureRedirect:    '/registration',
    failureFlash:       true,
    badRequestMessage:  'Hiányzó adatok'

}));

app.get('/login', function (req, res) {
    //res.sendFile(__dirname + '/public/html/login.html') ;
    res.render('login');
});
//app.post('/login', function (req, res) {
//    console.log(req);
//    res.render('index');
//});
app.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Hiányzó adatok'
}));


app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

//*** end points end ***


/* codes for me, to better understanding:
 *
 * socket.on - amit a kliens kuld
 * io.emit - amit a kliensnek kuldunk
 * socket.broadcast.to('room' + roomSize).emit("roomIsFull");
 * io.sockets.in('room' + roomSize).emit('roomIsFull');
 * */

io.on('connection', function (socket) {

    init(socket);

    socket.on("joined", onJoined.bind(socket));
    socket.on('disconnect', onLeave.bind(socket));

    // *** movements section ***
    socket.on('move', function (msg) {
        cubes[msg.sid] = msg.pos;
        socket.broadcast.to(socket.room).emit('move', msg);
    });

    socket.on("isCollision", function (obj) {
        socket.emit("isCollision", {respond: isCollision(obj)});
    });

    socket.on('update', function (msg) {
        socket.broadcast.to(socket.room).emit('update', msg);
    });

    socket.on('rotation', function (msg) {
        socket.broadcast.to(socket.room).emit('rotation', msg);
    });

    // *** page functions section ***
    socket.on('chat message', chatMessages);

    socket.on("giveNewCoin", giveNewCoin.bind(socket));

    socket.on("getDamage", function (obj) {
        socket.to(obj.room).broadcast.emit("getDamage", obj);
    });

    socket.on("readyAgain", readyAgain.bind(socket));

});

//******************************
//********** functions *********
//******************************

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function addPlayerToRoom(room, player) {
    if (roomManager[room].player1 == '') {
        roomManager[room].player1 = player;
    }
    else if (roomManager[room].player2 == '') {
        roomManager[room].player2 = player;
    }
}

function addRoom() {
    return {
        id: roomSize,
        name: 'room#' + roomSize,
        player1: '',
        player2: '',
        ready: {p1: false, p2: false}
    };
}

function findOnePlayerRoom() {
    for (var room in roomManager) {
        if (roomManager[room].player1 != '' && roomManager[room].player2 == '') {
            return roomManager[room].name;
        }
        else if (roomManager[room].player1 == '' && roomManager[room].player2 != '') {
            return roomManager[room].name;
        }
    }
    return "Something went wrong";
}

function getEnemyPlayerName(playerName, playerRoom) {
    var enemyName = '';
    for (var room in roomManager) {
        if (roomManager[room].name == playerRoom) {
            if (roomManager[room].player1 == playerName) {
                enemyName = roomManager[room].player2;
            }
            else if (roomManager[room].player2 == playerName) {
                enemyName = roomManager[room].player1;
            }
        }
    }
    return enemyName;
}

function generateNewCoinPositions(room) {
    coinPositions[room] = [];
    var positions = [];
    for (var i = 0; i < coinNumber; i++) {
        var x = Math.random() * gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
        var z = Math.random() * gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
        positions.push({x: x, z: z});
    }
    coinPositions[room] = positions;
}

function generateNewTrapPositions(room) {
    trapPositions[room] = [];
    var positions = [];
    for (var i = 0; i < trapNumber; i++) {
        var x = getRandomPosition();
        var z = getRandomPosition();
        positions.push({x: x, z: z});
    }
    trapPositions[room] = positions;
}

function isCollision(obj) {
    var otherPlayer = getEnemyPlayerName(obj.sid, obj.room);
    var thisSocket = obj.sid;
    var newX = obj.pos.x;
    var newZ = obj.pos.z;
    var movingSpeed = 0.05;

    if (otherPlayer !== '') {
        var colX = Math.abs(newX - cubes[otherPlayer].x);
        var colZ = Math.abs(newZ - cubes[otherPlayer].z);
        var originalX = Math.abs(cubes[thisSocket].x - cubes[otherPlayer].x);
        var originalZ = Math.abs(cubes[thisSocket].z - cubes[otherPlayer].z);
        return (colX < 1 && colZ < 1) && (originalX > colX && originalZ > colZ);
    }
    return false;
}

function init(socket) {
    // *** connection section ***
    ++joinedUsers;
    if (joinedUsers % 2 != 0) {
        roomSize = Object.keys(roomManager).length;

        //checking unused roomId-s to avoid id-collision (for example: 0,1,3,4 id's next value: 2, then 5)
        var usedRoomId = false;
        for (var room in roomManager) {
            if (roomManager[room].id == roomSize) {
                usedRoomId = true;
            }
        }
        if (usedRoomId) {
            //calculate correct id

            var goodId = 0;
            for (var room in roomManager) {
                if (roomManager[room].id == goodId) {
                    ++goodId;
                } else {
                    var newIdIsGood = true;
                    for (var subroom in roomManager) {
                        if (roomManager[subroom].id == goodId) {
                            newIdIsGood = false;
                        }
                    }
                    if (newIdIsGood) {
                        roomSize = goodId;
                        break; //break the cycle
                    } else {
                        ++goodId;
                    }
                }

            }

            var roomName = 'room#' + roomSize;
            roomManager[roomName] = addRoom();
            roomMessages[roomName] = [];
            socket.join(roomName);
            socket.room = roomName;
            roomSize = Object.keys(roomManager).length - 1; //jump to the last known 'good' value

        } else {
            var roomName = 'room#' + roomSize;
            roomManager[roomName] = addRoom();
            roomMessages[roomName] = [];
            socket.join(roomName);
            socket.room = roomName; //if everything went well, we don't need to jump
        }

    } else {
        var emptyRoom = findOnePlayerRoom(); //enough to find an empty room
        socket.join(emptyRoom);
        socket.room = emptyRoom;

        generateNewCoinPositions(emptyRoom);
        generateNewTrapPositions(emptyRoom);

        console.log("DEBUG " + coinPositions[socket.room].length);
        io.to(socket.room).emit("objectPositions", {
            coinPositions: coinPositions[socket.room],
            trapPositions: trapPositions[socket.room]
        });

    }
    io.to(socket.room).emit('new', {
        sid: socket.id,
        room: socket.room,
        positions: {x: getRandomPosition(), z: getRandomPosition()}
    });
    io.to(socket.room).emit("old messages", {sid: socket.id, historyMessage: roomMessages[socket.room]});
    //socket.emit("joined");

    addPlayerToRoom(socket.room, socket.id);
    console.log("user: " + socket.id + ' connected to: ' + socket.room);
}

function onJoined(obj) {
    this.username = obj.userName;
    cubes[this.id] = obj.cube;
    console.log(this.id + " joined with this:  [" + cubes[this.id].x + ", " + cubes[this.id].y + ", " + cubes[this.id].z + "]");
    this.to(this.room).broadcast.emit("joined");
}

function onLeave() {
    if (joinedUsers % 2 != 0) {
        --roomSize;
    }

    console.log("user: " + this.id + ' disconnect from: ' + this.room);

    //removeEmptyRoom
    for (var room in roomManager) {
        if (roomManager[room].player1 == this.id) {
            roomManager[room].player1 = '';
        }
        if (roomManager[room].player2 == this.id) {
            roomManager[room].player2 = '';
        }
        if (roomManager[room].player1 == '' && roomManager[room].player2 == '') {
            var roomName = roomManager[room].name;
            delete roomManager[roomName];
            delete roomMessages[roomName];
            //roomManager.splice(i, 1);
            delete coinPositions[roomName];
            delete trapPositions[roomName];

            console.log("Tarolt szoba uzenetek merete torles utan: " + Object.keys(roomMessages).length)
        }
    }
    --joinedUsers;
    io.to(this.room).emit('disconnect', this.id);
    this.leave(this.room);

    console.log("csatlakozott jatekosok szama: " + joinedUsers);
    console.log("szobak szama: " + Object.keys(roomManager).length);
}

function getRandomPosition() {
    var pos = 0;
    while (pos <= 1 && pos >= -1) {
        pos = Math.floor(Math.random() * 2) % 2 == 0 ? Math.random() * ((gameWidth / 2) - cubeHalf - 6) : -1 * Math.random() * ((gameWidth / 2) - cubeHalf - 2);
    }
    return pos;
}

function giveNewCoin(obj) {
    coinPositions[this.room].splice(obj.index, 1);
    var x = Math.random() * gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
    var z = Math.random() * gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
    coinPositions[this.room].push({x: x, z: z});
    io.to(this.room).emit("giveNewCoin", {
        sid: this.id,
        socketPoints: obj.socketPoints,
        index: obj.index,
        x: x,
        z: z
    });
}

function readyAgain(obj) {
    for (var room in roomManager) {
        if (roomManager[room].name == obj.room) {
            if (roomManager[room].player1 == obj.sid) {
                if (!roomManager[room].ready.p1) {
                    roomManager[room].ready.p1 = true;
                }
            }
            if (roomManager[room].player2 == obj.sid) {
                if (!roomManager[room].ready.p2) {
                    roomManager[room].ready.p2 = true;
                }
            }
            if (roomManager[room].ready.p1 && roomManager[room].ready.p2) {
                io.to(obj.room).emit("readyAgain");
                coinPositions[this.room] = [];
                trapPositions[this.room] = [];

                generateNewCoinPositions(this.room);
                generateNewTrapPositions(this.room);

                io.to(this.room).emit("objectPositions", {
                    coinPositions: coinPositions[this.room],
                    trapPositions: trapPositions[this.room]
                });
                io.to(this.room).emit("objectPositions", {
                    coinPositions: coinPositions[this.room],
                    trapPositions: trapPositions[this.room]
                });

                roomManager[room].ready.p1 = false;
                roomManager[room].ready.p2 = false;
            }
        }
    }
}

function chatMessages(obj) {
    if (roomMessages[obj.room].length == 5) {
        roomMessages[obj.room].shift();
    }
    roomMessages[obj.room].push(obj.msg);

    io.to(obj.room).emit('chat message', obj);
}

//*****************************
//***** server start **********
//*****************************

http.listen(port, function () {
    console.log('Server is started, listening on port:', port);
});

// **** ORM instance ****
// var orm = new Waterline();
// orm.loadCollection(Waterline.Collection.extend(userCollection));

// orm.initialize(waterlineConfig, function (err, models) {
//     if (err) {
//         throw err;
//     }

//     app.models = models.collections;
//     app.connections = models.connections;

//     // Start Server
//     app.listen(port, function () {
//         console.log('Server is started, listening on port:' + port);
//     });

//     console.log("ORM is started.");
// });