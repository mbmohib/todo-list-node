const express = require('express');
const Todo = require('../models/todo');
const auth = require('../middleware/auth');

const router = new express.Router();

router.get('/todos', auth, async (req, res) => {
  try {
    const user = await req.user.populate('todo').execPopulate();
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
