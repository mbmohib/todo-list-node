const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/users', (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => res.status(201).send({ user, token }))
    .catch(error => {
      res.status(400).send(error);
    });
});

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.get('/users/:id', auth, (req, res) => {
  const id = req.params.id;
  User.findById({ _id: id })
    .then(user => {
      if (!user) {
        return res.status(400).send('User not found');
      }
      res.send(user);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

router.patch('/users/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'age', 'password'];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Operation!' });
  }

  try {
    const user = await User.findById(req.params.id);
    updates.forEach(update => (user[update] = req.body[update]));

    await user.save();

    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.params.id);
    // if (!user) {
    //   return res.status(404).send();
    // }
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user: user, token: token });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
