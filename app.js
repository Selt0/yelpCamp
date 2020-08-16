import express from 'express';
import bodyParser from 'body-parser';
import mongodb from './keys.js';
import mongoose from 'mongoose';
import Campground from './models/campground.js';
import Comment from './models/comment.js';
import seedDB from './seeds.js';

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

// INDEX
app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  // get campgrounds from database
  Campground.find({}, (err, campgrounds) => {
    if (err) return console.error(err);

    res.render('index', { campgrounds: campgrounds });
  });
});

app.post('/campgrounds', (req, res) => {
  // get data from form
  let newCampground = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
  };

  // add to campgrounds db
  Campground.create(newCampground, (err, campground) => {
    err ? console.error(err) : console.log(`${campground.name} saved to DB!`);
  });

  // redirect back to campground
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

// SHOW
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, campground) => {
      if (err) return console.error(err);

      res.render('show', { campground: campground });
    });
});
app.listen(port, () => {
  console.log('Sever is live!');
});
