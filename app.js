import express from 'express';
import bodyParser from 'body-parser';
import mongodb from './keys.js';
import mongoose from 'mongoose';
import Campground from './models/campground.js';
import Comment from './models/comment.js';
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

app.get('/', (req, res) => {
  res.render('landing');
});

// INDEX
app.get('/campgrounds', (req, res) => {
  // get campgrounds from database
  Campground.find({}, (err, campgrounds) => {
    if (err) return console.error(err);

    res.render('campgrounds/index', { campgrounds: campgrounds });
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

// NEW
app.get('/campgrounds/:id/comments/new', (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) return console.error(err);
    res.render('comments/new', { campground: campground });
  });
});

// CREATE
app.post('/campgrounds/:id/comments', (req, res) => {
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

app.listen(port, () => {
  console.log('Sever is live!');
});
