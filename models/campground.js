import mongoose from 'mongoose';
import Comment from './comment.js';

const campgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  location: String,
  lat: Number,
  lng: Number,
  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

campgroundSchema.pre('remove', async function () {
  await Comment.remove({
    id: {
      $in: this.comments,
    },
  });
});

export default mongoose.model('Campground', campgroundSchema);
