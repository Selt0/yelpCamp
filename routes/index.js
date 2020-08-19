import express from 'express';
import passport from 'passport';
import User from '../models/user.js';
import Campground from '../models/campground.js';
import Comment from '../models/comment.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('landing');
});

// register form
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('register');
    }

    passport.authenticate('local')(req, res, () => {
      req.flash('success', `Welcome to yelpCamp, ${user.username}!`);
      res.redirect('/campgrounds');
    });
  });
});

// login form
router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  })
);

// logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged out!');
  res.redirect('/campgrounds');
});

// check if user is loggined in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'You must be logged in!');
  res.redirect('/login');
}

// check if user owns campground
function checkCampgroundOwnership(req, res, next) {
  // check if user is logged in
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, campground) => {
      if (err || !campground) {
        req.flash('error', 'Campground not found!');
        res.redirect('/campgrounds');
        // check if logged in user matched campground owner
      } else if (campground.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash('error', "You don't have permission to do that.");
        res.redirect('back');
      }
    });
  } else {
    req.flash('error', 'You must be logged in!');
    res.redirect('back');
  }
}

// check if user owns comment

function checkCommentOwnership(req, res, next) {
  // check if user is logged in
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err || !comment) {
        req.flash('error', 'Comment not found!');
        return res.redirect('/campgrounds');
      }
      // check if id matches logged in user
      if (comment.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash('error', "You don't have permission to do that");
        res.redirect('back');
      }
    });
  } else {
    req.flash('error', 'You must be logged in!');
    res.redirect('back');
  }
}

export { isLoggedIn, checkCampgroundOwnership, checkCommentOwnership };
export default router;
