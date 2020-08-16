import express from 'express';
import bodyParser from 'body-parser';
import { mongoURI as mongodb } from './keys.js';
import mongoose from 'mongoose';

const app = express();
const port = 5000;

mongoose
  .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to DB!'))
  .catch((error) => console.error(error.message));

const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

const Campground = mongoose.model('Campground', campgroundSchema);

// let campgrounds = [
//   { name: 'Salmon Creek', image: 'images/pexels-snapwire-699558.jpg' },
//   { name: 'Granite Hill', image: 'images/pexels-xue-guangjian-1687845.jpg' },
//   { name: 'Mountain Goat Rest', image: 'images/pexels-guduru-ajay-bhargav-939723.jpg' },
//   { name: 'Itasca', image: 'images/pexels-mac-destroir-2662816.jpg' },
//   { name: 'Salmon Creek', image: 'public/images/pexels-snapwire-699558.jpg' },
//   { name: 'Granite Hill', image: 'images/pexels-xue-guangjian-1687845.jpg' },
//   { name: 'Mountain Goat Rest', image: 'images/pexels-guduru-ajay-bhargav-939723.jpg' },
//   { name: 'Itasca', image: 'images/pexels-mac-destroir-2662816.jpg' },
// ];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

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

app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) return console.error(err);

    res.render('show', { campground: campground });
  });
});
app.listen(port, () => {
  console.log('Sever is live!');
});
