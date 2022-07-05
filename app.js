
var express = require('express')
  , passport = require('passport')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , passportSteam = require('passport-steam')
  , util = require('util')
  , authRoutes = require('./routes/auth')
  , paypal = require('paypal-rest-sdk');


const ejsLint = require('ejs-lint');
const expressLayouts = require('express-ejs-layouts');
//const rcon = require('./modules/rcon.js');
//const { default: RCON } = require('rcon-srcds');
//const Rcon = require('rcon');
require('dotenv').config()
//require('./modules/rcon.js')
//require('./src/rcon.js');


/* paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AbjikbSMGJydMkkTvIU7MNxo_N6o8Nt3ACUCC98rhVlW8UTvLobWr5099rjM804Btao7ATYNz_MYsYnt',
    'client_secret': 'EAIY1eescgTOq0aP5nQhBh2KjSVq3Fj9wSqrLZy-iSv35Lhurn9LanCPDINEA1g2ftrWBDPnQuvpImR_'
}); */


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
    returnURL: 'http://kveddo.com/auth/steam/return',
    realm: 'http://kveddo.com/',
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

/* app.post('/pay', (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Vip",
                    "sku": "001",
                    "price": "5.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "5.00"
            },
            "description": "This is the payment description."
        }]
    }
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error
        } else {
            for(let i = 0;i < payment.links.lenght;i++){
                if(payment.links[i].rel === 'approval_url'){
                    res.redirect(payment.links[i].href)
                }
            }
        }
    })
})

app.get('/success', (req, res) => {
    const payerId = req.query.PayerID
    const paymentId = req.query.paymentId

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "5.00"
            }
        }]
    }

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response)
            throw error
        } else {
            console.log(JSON.stringify(payment))
            res.send('success')
        }
    })
})


app.get('/cancel', (req, res) => res.send('cancelled')) */


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
        socketTimeout: 1000
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

app.listen(process.env.PORT || PORT, async function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}
/* if (typeof(PhusionPassenger) !== 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
}

app.get('/', function(req, res) {
    var body = 'Hello World';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});

if (typeof(PhusionPassenger) !== 'undefined') {
    app.listen('passenger');
} else {
    app.listen(3000);
} */