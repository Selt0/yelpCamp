import express from 'express';
import bodyParser from 'body-parser';
import mongodb from '/config/keys.js';
import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.js';
import expressSession from 'express-session';
import methodOverride from 'method-override';
import flash from 'connect-flash';
import moment from 'moment';

// routes
import campgroundRoutes from './routes/campgrounds.js';
import commentRoutes from './routes/comments.js';
import indexRoutes from './routes/index.js';

// import seedDB from './seeds.js';
// seedDB(); // reset database

const app = express();
const port = process.env.PORT || 5000;
mongoose
  .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to DB!'))
  .catch((error) => console.error(error.message));

// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = moment;

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

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// routes
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(port, () => {
  console.log('Sever is live!');
});
