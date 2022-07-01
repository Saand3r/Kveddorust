
server({
    log: {
      level: 'info',
      report: (content, type) => {
        console.log(content);
      }
    }
  });

var express = require('express')
  , passport = require('passport')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , passportSteam = require('passport-steam')
  , util = require('util')
  , authRoutes = require('./routes/auth');


const ejsLint = require('ejs-lint');
const expressLayouts = require('express-ejs-layouts');
const rcon = require('./modules/rcon.js');
//const { default: RCON } = require('rcon-srcds');
//const Rcon = require('rcon');
require('dotenv').config()
require('./modules/rcon.js')
//require('./src/rcon.js');


var SteamStrategy = passportSteam.Strategy;

ejsLint("ejs")

//Passport configuration
passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Initiate Strategy
passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: process.env.STEAM_API
    }, function (identifier, profile, done) {
     process.nextTick(function () {
      profile.identifier = identifier;
      return done(null, profile);
     });
    }
));

var app = express();
app.use(bodyParser.json());
app.use(expressLayouts)

//Express configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


var PORT = 3000;

app.use(session({
    secret: process.env.SESSION_SECRET,
    name: 'CHrisbrOwn',
    saveUninitialized: true,
    resave: true,
    saveUninitialized: true
}))

//Passport initialize
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


app.use('/public', express.static('./public/'))

app.get('/', function(req, res) {
    res.status(200)
    res.render('index', { title: 'Kveddo', user: req.user })
});

app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { title: 'Kveddo Rust', user: req.user });
});

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});


app.use('/onlineplayers', (req, res) => {
    const Gamedig = require('gamedig')
    Gamedig.query({
        type: 'rust',
        host: 'oslo14.spillvert.no',
        port: 28215,
        requestRules: true,
        maxAttempts: 1000,
        socketTimeout: 10000
    }).then((state) => {
        const numplayers = state.raw.numplayers
        const wipeTime = state.raw.tags[8].substring(4)
        const mapType = state.map
        res.json([numplayers, wipeTime, mapType])
        return
    }).catch((error) => {
        console.log(error)
    })
})

app.use('/store', (req, res) => {
    res.status(200)
    res.render('store', { title: 'Kveddo Store', user: req.user })
})

app.use('/commands', (req, res) => {
    res.status(200)
    res.render('commands', { title: 'Kveddo Commands', user: req.user })
})

app.use('/contact', (req, res) => {
    res.status(200)
    res.render('contact', { title: 'Kveddo Contact', user: req.user })
})

// See views/auth.js for authentication routes
app.use('/auth', authRoutes);

app.listen(PORT, async function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}