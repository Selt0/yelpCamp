import express from 'express';
import passport from 'passport';
import User from '../models/user.js';

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

export { isLoggedIn };
export default router;
