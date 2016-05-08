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
var gameObjects = require("./js/game_objects");
var roomFunctions = require("./js/room_functions");
var initializer = require("./js/init.js");
var gameVars = require("./js/globals");

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
                return done(null, false, {message: 'Letezo felhasznalonev.'});
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

app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
    res.render('index', {
        validationSuccess: req.flash()
    });
});
app.get('/game', ensureAuthenticated, function (req, res) {
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
});


app.get('/highscore', ensureAuthenticated, function (req, res) {
    req.app.models.user.findOne({username: req.user.username}, function(err, user){

        res.render('highscore', {
            highscore: (req.user ? user.highscore : undefined)
        });
    });
    
});

app.get('/registration', function (req, res) {
    res.render('registration', {
        validationErrors: req.flash('error')
    });
});


app.post('/registration', passport.authenticate('registration', {
    successRedirect: '/',
    failureRedirect: '/registration',
    failureFlash: true,
    successFlash: 'Sikeres regisztracio!',
    badRequestMessage: 'Hianyzo adatok'
}));

app.get('/login', function (req, res) {
    res.render('login', {
        validationErrors: req.flash('error')
    });
});

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

    initializer.init(socket);

    socket.on("joined", joinLeave.onJoined.bind(socket));
    socket.on('disconnect', joinLeave.onLeave.bind(socket));

    // *** movements section ***
    socket.on('move', function (msg) {
        gameVars.cubes[msg.sid] = msg.pos;
        socket.broadcast.to(socket.room).emit('move', msg);
    });

    socket.on("isCollision", function (obj) {
        socket.emit("isCollision", {respond: gameObjects.isCollision(obj)});
    });

    socket.on('update', function (msg) {
        socket.broadcast.to(socket.room).emit('update', msg);
    });

    socket.on('rotation', function (msg) {
        socket.broadcast.to(socket.room).emit('rotation', msg);
    });

    // *** page functions section ***
    socket.on('chat message', chatMessages);

    socket.on("giveNewCoin", gameObjects.giveNewCoin.bind(socket));

    socket.on("getDamage", function (obj) {
        socket.to(obj.room).broadcast.emit("getDamage", obj);
    });

    socket.on("readyAgain", roomFunctions.readyAgain.bind(socket));

});

//******************************
//********** functions *********
//******************************

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
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