import express from 'express';

const app = express();
const port = 5000;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  let campgrounds = [
    { name: 'Salmon Creek', image: 'images/pexels-snapwire-699558.jpg' },
    { name: 'Granite Hill', image: 'images/pexels-xue-guangjian-1687845.jpg' },
    { name: 'Mountain Goat Rest', image: 'images/pexels-guduru-ajay-bhargav-939723.jpg' },
    { name: 'Itasca', image: 'images/pexels-mac-destroir-2662816.jpg' },
  ];

  res.render('campgrounds', { campgrounds: campgrounds });
});

app.listen(port, () => {
  console.log('Sever is live!');
});
