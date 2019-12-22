const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/todo-list-api', {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const User = mongoose.model('User', {
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
});

const me = new User({
  name: 'Mohib',
  age: 27,
});

me.save()
  .then(() => {
    console.log(me);
  })
  .catch(error => {
    console.error(error);
  });
