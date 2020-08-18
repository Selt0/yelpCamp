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
      console.error(err);
      return res.render('register');
    }

    passport.authenticate('local')(req, res, () => {
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
  res.redirect('/campgrounds');
});

// check if user is loggined in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect('/login');
}

// check if user owns campground
function checkCampgroundOwnership(req, res, next) {
  // check if user is logged in
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, campground) => {
      if (err) return res.redirect('/campgrounds');
      // check if id matches logged in user
      if (campground.author.id.equals(req.user._id)) {
        next();
      } else {
        res.redirect('back');
      }
    });
  } else {
    res.redirect('back');
  }
}

// check if user owns comment

function checkCommentOwnership(req, res, next) {
  // check if user is logged in
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) return res.redirect('/campgrounds');
      // check if id matches logged in user
      if (comment.author.id.equals(req.user._id)) {
        next();
      } else {
        res.redirect('back');
      }
    });
  } else {
    res.redirect('back');
  }
}

export { isLoggedIn, checkCampgroundOwnership, checkCommentOwnership };
export default router;
