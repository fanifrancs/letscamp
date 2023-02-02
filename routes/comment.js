const express = require('express'),
Campground    = require('../models/campground'),
Comment       = require('../models/comment'),
router        = express.Router();

router.get('/campgrounds/:id/comment/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            res.redirect('/campgrounds/' + campground._id);
        } else {
            res.render('comment/new', {campground: campground});
        }
    })
})

router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            res.redirect('/campgrounds/' + campground._id);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    res.redirect('/campgrounds/' + campground._id);
                } else {
                	comment.author.id = req.user._id;
                	comment.author.username = req.user.username;
                	comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
})

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    };
    req.flash('error', 'please login first');
    res.redirect('/login');
}

module.exports = router;