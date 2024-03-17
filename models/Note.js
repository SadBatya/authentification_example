const mongosee = require('mongoose');

let Schema = mongosee.Schema;

let NoteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    require: true,
  },
});

let Note = mongosee.model('Note', NoteSchema);

module.exports = Note;
