const express = require('express');
require('./db/mongoose');
const User = require('./models/User');
const Todo = require('./models/Todo');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => res.status(201).send(user))
    .catch(error => {
      res.status(400).send(error);
    });
});

app.get('/users', (req, res) => {
  User.find({})
    .then(users => {
      res.send(users);
    })
    .catch(error => {
      res.status(500).send();
    });
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  User.findById({ _id: id })
    .then(user => {
      if (!user) {
        return res.status(400).send('User not found');
      }
      res.send(user);
    })
    .catch(error => {
      res.status(500).send();
    });
});

app.get('/todos', (req, res) => {
  Todo.find({})
    .then(todos => {
      res.send(todos);
    })
    .catch(error => {
      res.status(500).send();
    });
});

app.post('/todo', (req, res) => {
  const todo = new Todo(req.body);
  todo
    .save()
    .then(() => res.status(201).send(todo))
    .catch(error => {
      res.status(400).send(error);
    });
});

app.listen(port, () => console.log('Server is up on port ', port));
