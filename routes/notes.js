const notes = require('express').Router();
const db = './db/notes.json'
const { v4: uuidv4 } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile
  } = require('../helpers/fsUtils.js');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  readFromFile(db).then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific note
notes.get('/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile(db)
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.id === noteId);
        return result.length > 0
          ? res.json(result)
          : res.json('No note with that ID');
      });
  });
  
  // DELETE Route for a specific note
  notes.delete('/:id', async (req, res) => {
    const noteId = req.params.id;
  
    try {
      // Read data from the file
      const data = await readFromFile(db);
      const notes = JSON.parse(data);
  
      // Filter out the note with the given ID
      const updatedNotes = notes.filter((note) => note.id !== noteId);
  
      // Write updated notes back to the file
      await writeToFile(db, updatedNotes);
  
      // Respond to the DELETE request
      res.json(`Note with ID ${noteId} has been deleted 🗑️`);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json('Internal Server Error');
    }
  });

// POST Route for a new UX/UI note
notes.post('/', (req, res) => {
  console.log(req.body);
2
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
     title,
     text,
     id: uuidv4(),
    };

    readAndAppend(newNote, db);
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});

module.exports = notes;
