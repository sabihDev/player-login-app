const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://8203sabirahman:sabi11.333@playerapp.obw1rju.mongodb.net/")
  .then(() => {
    console.log('mongoose connected');
  })
  .catch((e) => {
    console.log('failed');
  });

const logInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

var LogInCollection = mongoose.model('logincollections', logInSchema);

module.exports = LogInCollection;
