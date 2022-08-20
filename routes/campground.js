const express  = require('express'),
Campground     = require('../models/campground'),
router         = express.Router();

router.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log('error');
        } else {
            res.render('index', {campgrounds: campgrounds});
        }
    })
});

router.get('/campgrounds/new', isLoggedIn, (req, res) => {
    res.render('new');
});

router.post('/campgrounds', isLoggedIn, (req, res) => {
	let author = {
		id: req.user._id,
		username : req.user.username
	};
    Campground.create({...req.body.campground, author}, (err, newcampground) => {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/campgrounds');
        }
    })
});

router.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.render('show', {campground: campground});
        }
    })
});

router.delete('/campgrounds/:id', checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    })
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    };
    req.flash('error', 'please login first');
    res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next){
    if (req.isAuthenticated()) {
	        Campground.findById(req.params.id, (err, campground) => {
	        if (err) {
	        	res.redirect('back');
	        } else {
	            if (campground.author.id.equals(req.user._id)) {
	            	next();
	            } else {
	            	res.redirect('back');
	            }
	        }
    	})
    } else {
    	req.flash('error', 'please login first');
    	res.redirect('/login');
    }
}

module.exports = router;