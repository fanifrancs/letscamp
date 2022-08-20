const express = require('express'),
passport      = require('passport'),
User          = require('../models/user'),
router        = express.Router();

router.get('/', (req, res) => {
    res.redirect('/campgrounds');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    let newUser = new User({username : req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', `Hello ${user.username}, welcome to Let's Camp`);
            res.redirect('/campgrounds');
        });
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local',
    {
       successRedirect : '/campgrounds',
       failureRedirect : '/login', 
    }), (req, res) => {}
);

router.get('/logout', (req, res) => {
    req.logout(() => {
        req.flash('success', 'You logged out');
        res.redirect('/login')
    });
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    };
    req.flash('error', 'please login first');
    res.redirect('/login');
}

module.exports = router;