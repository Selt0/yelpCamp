import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 5000;

let campgrounds = [
  { name: 'Salmon Creek', image: 'images/pexels-snapwire-699558.jpg' },
  { name: 'Granite Hill', image: 'images/pexels-xue-guangjian-1687845.jpg' },
  { name: 'Mountain Goat Rest', image: 'images/pexels-guduru-ajay-bhargav-939723.jpg' },
  { name: 'Itasca', image: 'images/pexels-mac-destroir-2662816.jpg' },
  { name: 'Salmon Creek', image: 'images/pexels-snapwire-699558.jpg' },
  { name: 'Granite Hill', image: 'images/pexels-xue-guangjian-1687845.jpg' },
  { name: 'Mountain Goat Rest', image: 'images/pexels-guduru-ajay-bhargav-939723.jpg' },
  { name: 'Itasca', image: 'images/pexels-mac-destroir-2662816.jpg' },
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', { campgrounds: campgrounds });
});

app.post('/campgrounds', (req, res) => {
  // get data from form and add to campgrounds
  let newCampground = {
    name: req.body.name,
    image: req.body.image,
  };

  campgrounds.push(newCampground);
  // redirect back to campground
  res.redirect('campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
  res.render('newCamp.ejs');
});

app.listen(port, () => {
  console.log('Sever is live!');
});
