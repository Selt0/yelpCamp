import express from 'express';
import Campground from '../models/campground.js';
import Comment from '../models/comment.js';
import { isLoggedIn } from './index.js';
const router = express.Router();

// INDEX
router.get('/', (req, res) => {
  // get campgrounds from database
  Campground.find({}, (err, campgrounds) => {
    if (err) return console.error(err);

    res.render('campgrounds/index', { campgrounds: campgrounds, currentUser: req.user });
  });
});

// CREATE
router.post('/', isLoggedIn, (req, res) => {
  // add to campgrounds db
  Campground.create(req.body.campground, (err, campground) => {
    err ? console.error(err) : console.log(`${campground.name} saved to DB!`);
    console.log(campground);
    campground.author.id = req.user._id;
    campground.author.username = req.user.username;
    campground.save();
    console.log(campground);
  });

  // redirect back to campground
  res.redirect('/campgrounds');
});

// NEW
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// SHOW
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, campground) => {
      if (err) return console.error(err);

      res.render('campgrounds/show', { campground: campground });
    });
});

export default router;
