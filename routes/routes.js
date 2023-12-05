const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');


const myDB = require('../db/myDB');
const { shiftList } = require('../data/shiftList');

const loginRedirect = '/?msg=login needed';



function isEmployee(req) {
  return req.session.user.position === 'employee';
}

function isManager(req) {
  return req.session.user.position === 'manager';
}

router.get('/api/userRole', (req, res) => {
  console.log('/api/userRole hit'); 
  if (req.session.user) {
    console.log('User is in session:', req.session.user);
    res.json({ role: req.session.user.position });
  } else {
    console.log('User not logged in');
    res.status(401).json({ error: 'User is not logged in' });
  }
});


router.get('/api/allReviews', async (req, res) => {
  if (!req.session.login || !isManager(req)) {
    return res.redirect(loginRedirect);
  }

  try {
    const docs = await myDB.getAllReviews();
    res.json(docs);
  } catch (err) {
    console.error('# Get Error', err);
    res.status(500).send({ error: `${err.name}, ${err.message}` });
  }
});

router.post('/api/login', async (req, res) => {
  const data = req.body;
  const user = await myDB.findUser(data.username);

  if (user) {
    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (passwordMatch) {
      req.session.user = user;
      req.session.login = true;
      const redirectPath = user.position === 'manager' ? '/manager' : '/employee';
      res.redirect(redirectPath);
    } else {
      res.redirect('/?msg=Your opassword is incorrect, please reenter');
    }
  } else {
    res.redirect('/?msg=user not exists');
  }
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

router.post('/api/addShift', async (req, res) => {
  if (!req.session.login || !isEmployee(req)) {
    return res.redirect(loginRedirect);  
  }

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

router.post('/api/deleteOneShift', async (req, res) => {
  if (!req.session.login || !isEmployee(req)) {
    return res.redirect(loginRedirect);  
  }

  const data = { shift: req.body.shift, name: req.session.user.username };

  try {
    const result = await myDB.deleteOneShift(data);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Shift not found or already deleted.' });
    }
    res.json({ message: 'Shift successfully deleted.' });
  } catch (err) {
    console.error('# Post Error in deleteOneShift', err);
    res.status(500).send({ error: `${err.name}, ${err.message}` });
  }
});

router.post('/api/giveReviews', async (req, res) => {
  if (!req.session.login || !isManager(req)) {
    return res.redirect(loginRedirect);
  }

  try {
    const data = await myDB.giveReviews(req.body);
    res.json(data);
  } catch (err) {
    console.error('# Post Error', err);
    res.status(500).send({ error: `${err.name}, ${err.message}` });
  }
});

router.get('/api/getByName', async (req, res) => {
  if (!req.session.login) {
    return res.redirect(loginRedirect);
  }

  try {
    const docs = await myDB.findByName(req.session.user.username);
    res.json(docs);
  } catch (err) {
    console.error('# Get Error', err);
    res.status(500).send({ error: `${err.name}, ${err.message}` });
  }
});

router.post('/api/clockin', async (req, res) => {
  if (!req.session.login || !isEmployee(req)) {
    return res.redirect(loginRedirect);
  }

  try {
    const data = req.body;
    data.name = req.session.user.username;

    await myDB.addCheckIn(data);
    res.json({ message: 'Successfully clocked in' });


  } catch (err) {
    console.error('# Get Error', err);
    res.status(500).send({ error: `${err.name}, ${err.message}` });
  }
});

router.post('/api/getCheckInByName', async (req, res) => {
  if (!req.session.login) {
    return res.redirect(loginRedirect);
  }

  try {
    const docs = await myDB.getCheckInByName(req.body);
    res.json(docs);
  } catch (err) {
    console.error('# Get Error', err);
    res.status(500).send({ error: `${err.name}, ${err.message}` });
  }
});

router.get('/api/logout', async (req, res) => {
  req.session.user = null;
  req.session.login = false;
  res.json();
});

router.post('/api/search', async (req, res) => {
  if (!req.session.login || !isManager(req)) {
    return res.redirect(loginRedirect);
  }

  try {
    const docs = await myDB.searchReviews(req.body);
    res.json(docs);
  } catch (err) {
    console.error('# Get Error', err);
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