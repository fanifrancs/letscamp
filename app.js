const express  = require('express'),
bodyParser     = require('body-parser'),
mongoose       = require('mongoose'),
methodOverride = require('method-override'),
passport       = require('passport'),
flash          = require('connect-flash'),
LocalStrategy  = require('passport-local'),
Campground     = require('./models/campground'),
Comment        = require('./models/comment'),
User           = require('./models/user'),
app            = express();

require('dotenv').config();

const commentRoutes = require('./routes/comment'),
campgroundRoutes    = require('./routes/campground'),
authRoutes          = require('./routes/index');

function connectDB() {
    try {
        // process.env.db_URI = mongodb_URI
        mongoose.connect(process.env.db_URI);
        console.log('connected to DB');
    } catch { 
        err => console.log(err, 'DB connection went wrong');
    }
}

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(require('express-session')({
    secret: 'Hello World',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);

app.listen(process.env.PORT || 3500, process.env.IP, () => {
    connectDB();
    console.log('server started || 3500');
});