const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

const connect = async () => {
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/xyz', {
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
connect();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  try {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/shortUrls', async (req, res) => {
  try {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating short URL');
  }
});

app.post('/deleteUrls', async (req, res) => {
  const selectedUrls = req.body.selectedUrls;

  try {
    await ShortUrl.deleteMany({ _id: { $in: selectedUrls } });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting URLs');
  }
});

app.get('/:shortUrl', async (req, res) => {
  await connect();
  try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) {
      return res.sendStatus(404);
    }

    shortUrl.clicks++;
    await shortUrl.save();

    res.redirect(shortUrl.full);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Server started on port 5000');
});

module.exports = app;



