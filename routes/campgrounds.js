import express from 'express';
import Campground from '../models/campground.js';
import Comment from '../models/comment.js';
import { isLoggedIn, checkCampgroundOwnership } from './index.js';
const router = express.Router();

// INDEX
router.get('/', (req, res) => {
  // get campgrounds from database
  Campground.find({}, (err, campgrounds) => {
    if (err) return console.error(err);

    res.render('campgrounds/index', { campgrounds: campgrounds });
  });
});

// CREATE
router.post('/', isLoggedIn, (req, res) => {
  // add to campgrounds db
  Campground.create(req.body.campground, (err, campground) => {
    err ? console.error(err) : console.log(`${campground.name} saved to DB!`);
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
      if (err || !campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('back');
      }

      res.render('campgrounds/show', { campground: campground });
    });
});

// EDIT
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    res.render('campgrounds/edit', { campground: campground });
  });
});

// UPDATE
router.put('/:id', checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
    if (err) return res.redirect('/campgrounds');
    req.flash('success', 'Campground updated!');
    res.redirect(`/campgrounds/${req.params.id}`);
  });
});

// DESTROY
router.delete('/:id', checkCampgroundOwnership, async (req, res) => {
  try {
    let foundCampground = await Campground.findById(req.params.id);
    await foundCampground.remove();
    req.flash('success', 'Campground removed.');
    res.redirect('/campgrounds');
  } catch (error) {
    console.error(error.message);
    res.redirect('/campgrounds');
  }
});

export default router;
