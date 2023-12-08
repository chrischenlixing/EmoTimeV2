const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const myDB = require('../db/myDB');
const { shiftList } = require('../data/shiftList');

const loginRedirect = '/?msg=login needed';


passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await myDB.findUser(username);
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      console.error('Passport LocalStrategy Error:', err);
      return done(err); 
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await myDB.findUserById(id);
    done(null, user);
  } catch (err) {
    console.error('Error occurred during deserialization:', err);
    done(err);
  }
});


function ensureAuthenticated(req, res, next) {
  if (req.session.login) {
    next(); 
  } else {
    res.redirect(loginRedirect); 
  }
}

function isEmployee(req, res, next) {
  if (req.session.user && req.session.user.position === 'employee') {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
}

function isManager(req, res, next) {
  if (req.session.user && req.session.user.position === 'manager') {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
}

router.get('/api/userRole', ensureAuthenticated, (req, res) => {
  if (req.session.user) {
    res.json({ role: req.session.user.position,
            username:req.session.user.username });
  } else {
    res.status(401).json({ error: 'User is not logged in' });
  }
});


router.get('/api/allReviews', ensureAuthenticated, isManager, async (req, res) => {
  try {
    const docs = await myDB.getAllReviews();
    res.json(docs);
  } catch (err) {
    console.error('# Get Error', err);
    res.status(500).json({ error: `${err.name}, ${err.message}` });
  }
});

router.post('/api/login', passport.authenticate('local', {
  failureRedirect: '/?msg=Invalid username or password'
}), (req, res) => {
  const user = req.user;
  req.session.user = user;
  req.session.login = true;
  const redirectPath = user.position === 'manager' ? '/manager' : '/employee';
  res.redirect(redirectPath);
});


router.post('/api/register', async (req, res) => {
  const data = req.body;

  try {
    if (await myDB.findUser(data.username)) {
      return res.redirect('/register?msg=user is already registered, please log in.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    await myDB.addUser(data);
    res.redirect('/?msg=register succeed');
  } catch (err) {
    console.error('# Post Error', err);
    res.status(500).send({ error: `${err.name}, ${err.message}` });
  }
});

router.post('/api/addShift', ensureAuthenticated, isEmployee, async (req, res) => {
  const data = { shift: req.body.shift, name: req.session.user.username };

  try {
    const item = await myDB.findOneShift(data);
    if (item) {
      return res.json({ message: 'This date is already selected, please choose another one.' });
    }

    const result = await myDB.addShift(data);
    res.json(result);
  } catch (err) {
    console.error('# Post Error', err);
    res.status(500).send({ error: `${err.name}, ${err.message}` });
  }
});

router.post('/api/deleteOneShift', ensureAuthenticated, async (req, res) => {
  const data = {
    shift: req.body.shift,
    name: req.body.name
  };

  try {
    const result = await myDB.deleteOneShift(data);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Shift is not found or already deleted.' });
    }
    res.json({ message: 'Shift successfully deleted.' });
  } catch (err) {
    console.error('# Post Error in deleteOneShift', err);
    res.status(500).send({ error: `${err.name}, ${err.message}` });
  }
});

router.post('/api/giveReviews', ensureAuthenticated, isManager, async (req, res) => {

  try {
    const data = await myDB.giveReviews(req.body);
    res.json(data);
  } catch (err) {
    console.error('# Post Error', err);
    res.status(500).send({ error: `${err.name}, ${err.message}` });
  }
});

router.get('/api/getByName', ensureAuthenticated, async (req, res) => {
  try {
    const docs = await myDB.findByName(req.session.user.username);
    res.json(docs);
  } catch (err) {
    console.error('# Get Error', err);
    res.status(500).send({ error: `${err.name}, ${err.message}` });
  }
});

router.post('/api/clockin', ensureAuthenticated, isEmployee, async (req, res) => {
  try {
    const data = req.body;
    data.name = req.session.user.username;

    await myDB.addCheckIn(data);
    res.json({ message: 'Successfully clocked in' });
  } catch (err) {
    console.error('# Post Error', err);
    res.status(500).send({ error: `${err.name}, ${err.message}` });
  }
});

router.post('/api/getCheckInByName', ensureAuthenticated, async (req, res) => {
  try {
    const docs = await myDB.getCheckInByName(req.body);
    res.json(docs);
  } catch (err) {
    console.error('# Post Error', err);
    res.status(500).send({ error: `${err.name}, ${err.message}` });
  }
});

router.get('/api/logout', async (req, res) => {
  req.session.user = null;
  req.session.login = false;
  res.json();
});

router.post('/api/search', ensureAuthenticated, isManager, async (req, res) => {
  try {
    const docs = await myDB.searchReviews(req.body);
    res.json(docs);
  } catch (err) {
    console.error('# Post Error', err);
    res.status(500).send({ error: `${err.name}, ${err.message}` });
  }
});

router.get('/api/getShiftList', async (req, res) => {
  res.send(shiftList);
});

router.get('*', async (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../frontend/build') });
});

module.exports = router;