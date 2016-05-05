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

var joinLeave = require("./js/join_leave");
var gameVars = require("./js/globals");

var usersHighScore = {};


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
                return done(null, false, {message: 'Letezo username.'});
            }
            req.app.models.user.create(req.body) //create new user
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

//*** game logic's stuffs end ***

//** endpoints start
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(session({
    cookie: {maxAge: 3600000},
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
    res.render('index', {
        //validationErrors: validationErrors,
        validationSuccess: req.flash()
        //data: data
    });
});
app.get('/game', function (req, res) {
    //res.sendFile(__dirname + '/public/html/game.html');
    console.log(res.locals.user);
    res.render('game', {
        highscore: (req.user ? req.user.highscore : undefined)
    });

});

app.get('/rules', function (req, res) {
    res.render('gameRules');
});

app.post('/savescore', function (req, res) {
    req.app.models.user.update({username: res.locals.user.username}, {
        highscore: req.body.highscore
        
    }).then(function(){
        
    });
    // usersHighScore[res.locals.user.username] = req.body.highscore;
});


app.get('/highscore', ensureAuthenticated, function (req, res) {
    req.app.models.user.findOne({username: req.user.username}, function(err, user){

        res.render('highscore', {
            highscore: (req.user ? user.highscore : undefined)
        });
    });
    
});

app.get('/registration', function (req, res) {
    //res.sendFile(__dirname + '/public/html/registration.html') ;
    //var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    //var data = (req.flash('data') || [{}]).pop(); //req.flash() tömböt ad vissza
    //console.log(req.flash('error'));
    res.render('registration', {
        //validationErrors: validationErrors,
        validationErrors: req.flash('error')
        //data: data
    });
});


app.post('/registration', passport.authenticate('registration', {
    successRedirect: '/',
    failureRedirect: '/registration',
    failureFlash: true,
    successFlash: 'Sikeres regisztracio!',
    badRequestMessage: 'Hianyzo adatok'
    //validationErrors:  'pasztmek'
}));

app.get('/login', function (req, res) {
    //res.sendFile(__dirname + '/public/html/login.html') ;
    res.render('login', {
        //validationErrors: validationErrors,
        validationErrors: req.flash('error'),
        //data: data
    });
});
//app.post('/login', function (req, res) {
//    console.log(req);
//    res.render('index');
//});
app.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Sikeres bejelentkezes!',
    badRequestMessage: 'Hianyzo adatok'
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
 * socket.broadcast.to('room' + gameVars.roomSize).emit("roomIsFull");
 * io.sockets.in('room' + gameVars.roomSize).emit('roomIsFull');
 * */

io.on('connection', function (socket) {

    //console.log(io)
    //console.log(socket)

    init(socket);

    socket.on("joined", joinLeave.onJoined.bind(socket));
    socket.on('disconnect', joinLeave.onLeave.bind(socket));

    // *** movements section ***
    socket.on('move', function (msg) {
        gameVars.cubes[msg.sid] = msg.pos;
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

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function addPlayerToRoom(room, player) {
    if (gameVars.roomManager[room].player1 == '') {
        gameVars.roomManager[room].player1 = player;
    }
    else if (gameVars.roomManager[room].player2 == '') {
        gameVars.roomManager[room].player2 = player;
    }
}

function addRoom() {
    return {
        id: gameVars.roomSize,
        name: 'room#' + gameVars.roomSize,
        player1: '',
        player2: '',
        ready: {p1: false, p2: false}
    };
}

function findOnePlayerRoom() {
    for (var room in gameVars.roomManager) {
        if (gameVars.roomManager[room].player1 != '' && gameVars.roomManager[room].player2 == '') {
            return gameVars.roomManager[room].name;
        }
        else if (gameVars.roomManager[room].player1 == '' && gameVars.roomManager[room].player2 != '') {
            return gameVars.roomManager[room].name;
        }
    }
    return "Something went wrong";
}

function getEnemyPlayerName(playerName, playerRoom) {
    var enemyName = '';
    for (var room in gameVars.roomManager) {
        if (gameVars.roomManager[room].name == playerRoom) {
            if (gameVars.roomManager[room].player1 == playerName) {
                enemyName = gameVars.roomManager[room].player2;
            }
            else if (gameVars.roomManager[room].player2 == playerName) {
                enemyName = gameVars.roomManager[room].player1;
            }
        }
    }
    return enemyName;
}

function generateNewCoinPositions(room) {
    gameVars.coinPositions[room] = [];
    var positions = [];
    for (var i = 0; i < gameVars.coinNumber; i++) {
        var x = Math.random() * gameVars.gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
        var z = Math.random() * gameVars.gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
        positions.push({x: x, z: z});
    }
    gameVars.coinPositions[room] = positions;
}

function generateNewTrapPositions(room) {
    gameVars.trapPositions[room] = [];
    var positions = [];
    for (var i = 0; i < gameVars.trapNumber; i++) {
        var x = getRandomPosition();
        var z = getRandomPosition();
        positions.push({x: x, z: z});
    }
    gameVars.trapPositions[room] = positions;
}

function isCollision(obj) {
    var otherPlayer = getEnemyPlayerName(obj.sid, obj.room);
    var thisSocket = obj.sid;
    var newX = obj.pos.x;
    var newZ = obj.pos.z;
    var movingSpeed = 0.05;

    if (otherPlayer !== '') {
        var colX = Math.abs(newX - gameVars.cubes[otherPlayer].x);
        var colZ = Math.abs(newZ - gameVars.cubes[otherPlayer].z);
        var originalX = Math.abs(gameVars.cubes[thisSocket].x - gameVars.cubes[otherPlayer].x);
        var originalZ = Math.abs(gameVars.cubes[thisSocket].z - gameVars.cubes[otherPlayer].z);
        return (colX < 1 && colZ < 1) && (originalX > colX && originalZ > colZ);
    }
    return false;
}

function init(socket) {
    // *** connection section ***
    ++gameVars.joinedUsers;
    if (gameVars.joinedUsers % 2 != 0) {
        gameVars.roomSize = Object.keys(gameVars.roomManager).length;

        //checking unused roomId-s to avoid id-collision (for example: 0,1,3,4 id's next value: 2, then 5)
        var usedRoomId = false;
        for (var room in gameVars.roomManager) {
            if (gameVars.roomManager[room].id == gameVars.roomSize) {
                usedRoomId = true;
            }
        }
        if (usedRoomId) {
            //calculate correct id

            var goodId = 0;
            for (var room in gameVars.roomManager) {
                if (gameVars.roomManager[room].id == goodId) {
                    ++goodId;
                } else {
                    var newIdIsGood = true;
                    for (var subroom in gameVars.roomManager) {
                        if (gameVars.roomManager[subroom].id == goodId) {
                            newIdIsGood = false;
                        }
                    }
                    if (newIdIsGood) {
                        gameVars.roomSize = goodId;
                        break; //break the cycle
                    } else {
                        ++goodId;
                    }
                }

            }

            var roomName = 'room#' + gameVars.roomSize;
            gameVars.roomManager[roomName] = addRoom();
            gameVars.roomMessages[roomName] = [];
            socket.join(roomName);
            socket.room = roomName;
            gameVars.roomSize = Object.keys(gameVars.roomManager).length - 1; //jump to the last known 'good' value

        } else {
            var roomName = 'room#' + gameVars.roomSize;
            gameVars.roomManager[roomName] = addRoom();
            gameVars.roomMessages[roomName] = [];
            socket.join(roomName);
            socket.room = roomName; //if everything went well, we don't need to jump
        }

    } else {
        var emptyRoom = findOnePlayerRoom(); //enough to find an empty room
        socket.join(emptyRoom);
        socket.room = emptyRoom;

        generateNewCoinPositions(emptyRoom);
        generateNewTrapPositions(emptyRoom);

        console.log("DEBUG " + gameVars.coinPositions[socket.room].length);
        io.to(socket.room).emit("objectPositions", {
            coinPositions: gameVars.coinPositions[socket.room],
            trapPositions: gameVars.trapPositions[socket.room]
        });

    }
    io.to(socket.room).emit('new', {
        sid: socket.id,
        room: socket.room,
        positions: {x: getRandomPosition(), z: getRandomPosition()}
    });
    io.to(socket.room).emit("old messages", {sid: socket.id, historyMessage: gameVars.roomMessages[socket.room]});
    //socket.emit("joined");

    addPlayerToRoom(socket.room, socket.id);
    console.log("user: " + socket.id + ' connected to: ' + socket.room);
}



function getRandomPosition() {
    var pos = 0;
    while (pos <= 1 && pos >= -1) {
        pos = Math.floor(Math.random() * 2) % 2 == 0 ? Math.random() * ((gameVars.gameWidth / 2) - gameVars.cubeHalf - 6) : -1 * Math.random() * ((gameVars.gameWidth / 2) - gameVars.cubeHalf - 2);
    }
    return pos;
}

function giveNewCoin(obj) {
    gameVars.coinPositions[this.room].splice(obj.index, 1);
    var x = Math.random() * gameVars.gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
    var z = Math.random() * gameVars.gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
    gameVars.coinPositions[this.room].push({x: x, z: z});
    io.to(this.room).emit("giveNewCoin", {
        sid: this.id,
        socketPoints: obj.socketPoints,
        index: obj.index,
        x: x,
        z: z
    });
}

function readyAgain(obj) {
    for (var room in gameVars.roomManager) {
        if (gameVars.roomManager[room].name == obj.room) {
            if (gameVars.roomManager[room].player1 == obj.sid) {
                if (!gameVars.roomManager[room].ready.p1) {
                    gameVars.roomManager[room].ready.p1 = true;
                }
            }
            if (gameVars.roomManager[room].player2 == obj.sid) {
                if (!gameVars.roomManager[room].ready.p2) {
                    gameVars.roomManager[room].ready.p2 = true;
                }
            }
            if (gameVars.roomManager[room].ready.p1 && gameVars.roomManager[room].ready.p2) {
                io.to(obj.room).emit("readyAgain");
                gameVars.coinPositions[this.room] = [];
                gameVars.trapPositions[this.room] = [];

                generateNewCoinPositions(this.room);
                generateNewTrapPositions(this.room);

                io.to(this.room).emit("objectPositions", {
                    coinPositions: gameVars.coinPositions[this.room],
                    trapPositions: gameVars.trapPositions[this.room]
                });

                gameVars.roomManager[room].ready.p1 = false;
                gameVars.roomManager[room].ready.p2 = false;
            }
        }
    }
}

function chatMessages(obj) {
    if (gameVars.roomMessages[obj.room].length == 5) {
        gameVars.roomMessages[obj.room].shift();
    }
    gameVars.roomMessages[obj.room].push(obj.msg);

    io.to(obj.room).emit('chat message', obj);
}

//*****************************
//***** server start **********
//*****************************

//http.listen(port, function () {
//    console.log('Server is started, listening on port:', port);
//});

// **** ORM instance ****
var orm = new Waterline();
orm.loadCollection(Waterline.Collection.extend(userCollection));

orm.initialize(waterlineConfig, function (err, models) {
    if (err) {
        console.log(" such error");
    }

    app.models = models.collections;
    app.connections = models.connections;

    // Start Server
    http.listen(port, function () {
        console.log('Server is started, listening on port:' + port);
    });

    console.log("ORM is started.");
});