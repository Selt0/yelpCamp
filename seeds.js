import mongoose from 'mongoose';
import Campground from './models/campground.js';
import Comment from './models/comment.js';

const seeds = [
  {
    name: "Cloud's Rest",
    price: 9.5,
    image: '/images/pexels-guduru-ajay-bhargav-939723.jpg',
    description:
      'This thing comes fully loaded. AM/FM radio, reclining bucket seats, and... power windows. So you two dig up, dig up dinosaurs? Yeah, but John, if The Pirates of the Caribbean breaks down, the pirates don’t eat the tourists. Eventually, you do plan to have dinosaurs on your dinosaur tour, right?',
    author: {
      id: '5f3b23712219dd412952aa4e',
      username: 'Potato-Head',
    },
  },
  {
    name: 'Desert Mesa',
    price: 0,
    image: '/images/pexels-mac-destroir-2662816.jpg',
    description:
      "What do they got in there? King Kong? What do they got in there? King Kong? Must go faster... go, go, go, go, go! God help us, we're in the hands of engineers. I gave it a cold? I gave it a virus. A computer virus. You know what? It is beets. I've crashed into a beet truck.So you two dig up, dig up dinosaurs? So you two dig up, dig up dinosaurs? Checkmate... We gotta burn the rain forest, dump toxic waste, pollute the air, and rip up the OZONE! 'Cause maybe if we screw up this planet enough, they won't want it anymore!",
    author: {
      id: '5f3b23712219dd412952aa4e',
      username: 'Potato-Head',
    },
  },
  {
    name: 'Canyon Floor',
    price: 0,
    image: '/images/pexels-snapwire-699558.jpg',
    description:
      "Just my luck, no ice. God help us, we're in the hands of engineers. So you two dig up, dig up dinosaurs? Yes, Yes, without the oops! I was part of something special. Must go faster. My dad once told me, laugh and the world laughs with you, Cry, and I'll give you something to cry about you little bastard!",
    author: {
      id: '5f3b23712219dd412952aa4e',
      username: 'Potato-Head',
    },
  },
  {
    name: 'Rock Peak',
    image: '/images/pexels-xue-guangjian-1687845.jpg',
    price: 10,
    description:
      "We gotta burn the rain forest, dump toxic waste, pollute the air, and rip up the OZONE! 'Cause maybe if we screw up this planet enough, they won't want it anymore! God creates dinosaurs. God destroys dinosaurs. God creates Man. Man destroys God. Man creates Dinosaurs.",
    author: {
      id: '5f3b23712219dd412952aa4e',
      username: 'Potato-Head',
    },
  },
  {
    name: 'Foggy Bottom',
    image:
      'https://images.unsplash.com/photo-1506535995048-638aa1b62b77?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60',
    price: 10.5,
    description:
      " Yes, Yes, without the oops! Just my luck, no ice. We gotta burn the rain forest, dump toxic waste, pollute the air, and rip up the OZONE! 'Cause maybe if we screw up this planet enough, they won't want it anymore! Must go faster. God help us, we're in the hands of engineers.Life finds a way. Must go faster... go, go, go, go, go! Hey, take a look at the earthlings. Goodbye! Just my luck, no ice. You really think you can fly that thing? My dad once told me, laugh and the world laughs with you, Cry, and I'll give you something to cry about you little bastard!",
    author: {
      id: '5f3b23712219dd412952aa4e',
      username: 'Potato-Head',
    },
  },
  {
    name: "Heaven's Door",
    image:
      'https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60',
    price: 10,
    description:
      "Forget the fat lady! You're obsessed with the fat lady! Drive us out of here! You know what? It is beets. I've crashed into a beet truck. Just my luck, no ice. Checkmate... Do you have any idea how long it takes those cups to decompose. Just my luck, no ice.God creates dinosaurs. God destroys dinosaurs. God creates Man. Man destroys God. Man creates Dinosaurs. Must go faster... go, go, go, go, go! Just my luck, no ice. Yeah, but John, if The Pirates of the Caribbean breaks down, the pirates don’t eat the tourists.",
    author: {
      id: '5f3b23712219dd412952aa4e',
      username: 'Potato-Head',
    },
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
        author: {
          id: '5f3b23712219dd412952aa4e',
          username: 'Potato-Head',
        },
      });
      campground.comments.push(comment);
      campground.save();
    }
  } catch (err) {
    return console.log(err);
  }
}

export default seedDB;
