import mongoose from 'mongoose';
import Campground from './models/campground.js';
import Comment from './models/comment.js';

const seeds = [
  {
    name: "Cloud's Rest",
    image: '/images/pexels-guduru-ajay-bhargav-939723.jpg',
    description:
      'This thing comes fully loaded. AM/FM radio, reclining bucket seats, and... power windows. So you two dig up, dig up dinosaurs? Yeah, but John, if The Pirates of the Caribbean breaks down, the pirates don’t eat the tourists. Eventually, you do plan to have dinosaurs on your dinosaur tour, right?',
  },
  {
    name: 'Desert Mesa',
    image: '/images/pexels-mac-destroir-2662816.jpg',
    description:
      "What do they got in there? King Kong? What do they got in there? King Kong? Must go faster... go, go, go, go, go! God help us, we're in the hands of engineers. I gave it a cold? I gave it a virus. A computer virus. You know what? It is beets. I've crashed into a beet truck.So you two dig up, dig up dinosaurs? So you two dig up, dig up dinosaurs? Checkmate... We gotta burn the rain forest, dump toxic waste, pollute the air, and rip up the OZONE! 'Cause maybe if we screw up this planet enough, they won't want it anymore!",
  },
  {
    name: 'Canyon Floor',
    image: '/images/pexels-snapwire-699558.jpg',
    description:
      "Just my luck, no ice. God help us, we're in the hands of engineers. So you two dig up, dig up dinosaurs? Yes, Yes, without the oops! I was part of something special. Must go faster. My dad once told me, laugh and the world laughs with you, Cry, and I'll give you something to cry about you little bastard!",
  },
  {
    name: 'Rock Peak',
    image: '/images/pexels-xue-guangjian-1687845.jpg',
    description:
      "We gotta burn the rain forest, dump toxic waste, pollute the air, and rip up the OZONE! 'Cause maybe if we screw up this planet enough, they won't want it anymore! God creates dinosaurs. God destroys dinosaurs. God creates Man. Man destroys God. Man creates Dinosaurs.",
  },
];

async function seedDB() {
  try {
    // Remove all campgrounds
    await Campground.remove({});
    // remove all comments
    await Comment.remove({});
    // add campgrounds from array
    for (const seed of seeds) {
      let campground = await Campground.create(seed);
      let comment = await Comment.create({
        text: 'This place is great, but I wish there was internet',
        author: 'Homer',
      });
      campground.comments.push(comment);
      campground.save();
    }
  } catch (err) {
    return console.log(err);
  }
}

export default seedDB;
