const express = require('express');
const Todo = require('../models/todo');
const auth = require('../middleware/auth');

const router = new express.Router();

router.get('/todos', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    const user = await req.user
      .populate({
        path: 'todo',
        match,
        options: {
          limit: parseInt(req.query.limit) || 2,
          skip: parseInt(req.query.offset),
          sort: sort,
        },
      })
      .execPopulate();
    res.send(user.todo);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/todos/:id', auth, (req, res) => {
  const _id = req.params.id;

  Todo.findById(_id)
    .then(todo => {
      if (!todo) {
        return res.status(400).send('Todo not found');
      }

      return todo.populate('owner').execPopulate();
    })
    .then(todo => {
      res.send(todo);
    })
    .catch(error => {
      res.status(500).send();
    });
});

router.post('/todo', auth, (req, res) => {
  const todo = new Todo({
    ...req.body,
    owner: req.user._id,
  });

  todo
    .save()
    .then(() => res.status(201).send(todo))
    .catch(error => {
      res.status(400).send(error);
    });
});

module.exports = router;
