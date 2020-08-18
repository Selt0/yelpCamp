import express from 'express';
import bodyParser from 'body-parser';
import mongodb from './keys.js';
import mongoose from 'mongoose';
import Campground from './models/campground.js';
import Comment from './models/comment.js';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.js';
import expressSession from 'express-session';
// import seedDB from './seeds.js';

// reset database
// seedDB();

const app = express();
const port = 5000;
mongoose
  .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to DB!'))
  .catch((error) => console.error(error.message));

// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  res.render('landing');
});

// configure passport
app.use(
  expressSession({
    secret: 'Panda Panda Panda',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==========
// CAMPGROUND
// ==========

// INDEX
app.get('/campgrounds', (req, res) => {
  // get campgrounds from database
  Campground.find({}, (err, campgrounds) => {
    if (err) return console.error(err);

    res.render('campgrounds/index', { campgrounds: campgrounds, currentUser: req.user });
  });
});

// CREATE
app.post('/campgrounds', (req, res) => {
  // add to campgrounds db
  Campground.create(req.body.campground, (err, campground) => {
    err ? console.error(err) : console.log(`${campground.name} saved to DB!`);
  });

  // redirect back to campground
  res.redirect('/campgrounds');
});

// NEW
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// SHOW
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, campground) => {
      if (err) return console.error(err);

      res.render('campgrounds/show', { campground: campground });
    });
});

// ========
// COMMENTS
// ========

// NEW
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) return console.error(err);
    res.render('comments/new', { campground: campground });
  });
});

// CREATE
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) return console.error(err);

    Comment.create(req.body.comment, (err, comment) => {
      if (err) return console.error(err);

      campground.comments.push(comment);
      campground.save();
      res.redirect(`/campgrounds/${campground._id}`);
    });
  });
});

// ==============
// AUTHENTICATION
// ==============

// register form
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
  res.render('login');
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  })
);

// logout
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

// check if user is loggined in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect('/login');
}
app.listen(port, () => {
  console.log('Sever is live!');
});
