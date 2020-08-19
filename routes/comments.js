import express from 'express';
import { isLoggedIn, checkCommentOwnership } from './index.js';
import Campground from '../models/campground.js';
import Comment from '../models/comment.js';
const router = express.Router({ mergeParams: true });

// NEW
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err || !campground) {
      req.flash('error', 'Campground not found!');
      return redirect('back');
    }
    res.render('comments/new', { campground: campground });
  });
});

// CREATE
router.post('/', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) return console.error(err);

    Comment.create(req.body.comment, (err, comment) => {
      if (err) return console.error(err);
      // add username and id to comment
      comment.author.id = req.user._id;
      comment.author.username = req.user.username;
      comment.save();

      campground.comments.push(comment);
      campground.save();
      req.flash('success', 'Comment posted.');
      res.redirect(`/campgrounds/${campground._id}`);
    });
  });
});

// EDIT
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err || !campground) {
      req.flash('error', 'Campground not found!');
      return res.redirect('back');
    }
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) return res.redirect('back');
      res.render('comments/edit', { campground_id: req.params.id, comment: comment });
    });
  });
});

// UPDATE
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
    if (err) return res.redirect('back');
    res.redirect(`/campgrounds/${req.params.id}`);
  });
});

// DESTROY
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, (err) => {
    req.flash('success', 'Comment removed.');
    res.redirect('back');
  });
});

export default router;
