const express = require('express');
const Todo = require('../models/Todo');

const router = new express.Router();

router.get('/todos', (req, res) => {
  Todo.find({})
    .then(todos => {
      res.send(todos);
    })
    .catch(error => {
      res.status(500).send();
    });
});

router.get('/todos/:id', (req, res) => {
  const _id = req.params.id;

  Todo.findById(_id)
    .then(todo => {
      if (!todo) {
        return res.status(400).send('Todo not found');
      }
      res.send(todo);
    })
    .catch(error => {
      res.status(500).send();
    });
});

router.post('/todo', (req, res) => {
  const todo = new Todo(req.body);
  todo
    .save()
    .then(() => res.status(201).send(todo))
    .catch(error => {
      res.status(400).send(error);
    });
});

module.exports = router;
