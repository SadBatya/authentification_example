const express = require('express');
const chalk = require('chalk');
const path = require('path');
const {
  addNote,
  getNotes,
  removeNote,
  updateNote,
} = require('./notes.controller');
const { addUser, loginUser } = require('./user.controller');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { error } = require('console');
const port = 3000;
const app = express();
const auth = require('./middlewares/auth');

app.set('view engine', 'ejs');
app.set('views', 'pages');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/login', async (req, res) => {
  res.render('login', {
    title: 'Express App',
    error: undefined,
  });
});

app.post('/login', async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);

    res.cookie('token', token, { httpOmly: true });

    res.redirect('/');
  } catch (error) {
    res.render('login', {
      title: 'Express App',
      error: error.message,
    });
  }
});

app.get('/register', async (req, res) => {
  res.render('register', {
    title: 'Express App',
    error: undefined,
  });
});

app.post('/register', async (req, res) => {
  try {
    await addUser(req.body.email, req.body.password);

    res.redirect('/login');
  } catch (error) {
    if (error.code == 11000) {
      res.render('register', {
        title: 'Express App',
        error: 'Email is already registered',
      });
      return;
    }

    res.render('register', {
      title: 'Express App',
      error: error.message,
    });
  }
});

app.get('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true });
  res.redirect('/login');
});

app.use(auth);

app.get('/', async (req, res) => {
  res.render('index', {
    title: 'Express App',
    notes: await getNotes(),
    userEmail: req.user.email,
    created: false,
    error: error.message,
  });
});

app.post('/', async (req, res) => {
  try {
    await addNote(req.body.title, req.user.email);
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: true,
      error: false,
    });
  } catch (error) {
    console.log('error:', error);
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: true,
    });
  }
});

app.delete('/:id', async (req, res) => {
  try {
    await removeNote(req.params.id);
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: true,
      error: false,
    });
  } catch (error) {
    res.render('ind ex', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: true,
      error: error.message,
    });
  }
});

app.put('/:id', async (req, res) => {
  try {
    await updateNote({ id: req.params.id, title: req.body.title });
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (error) {
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: error.message,
    });
  }
});

mongoose
  .connect(
    'mongodb+srv://vladimir:14235678Asdf@sadbatya.se480p9.mongodb.net/?retryWrites=true&w=majority&appName=sadbatya'
  )
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.green(`Server has been started on port ${port}...`));
    });
  });
