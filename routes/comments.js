import express from 'express';
import { isLoggedIn } from './index.js';
import Campground from '../models/campground.js';
import Comment from '../models/comment.js';
const router = express.Router({ mergeParams: true });

// NEW
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) return console.error(err);
    res.render('comments/new', { campground: campground });
  });
});

// CREATE
router.post('/', isLoggedIn, (req, res) => {
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

export default router;
