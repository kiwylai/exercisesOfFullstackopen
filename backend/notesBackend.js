const Note = require("./models/note");
const getAllNotes = (_, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
};

const getNote = (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      response.json(note);
    })
    .catch((_) => {
      response.status(404).end();
    });
};

const updateNote = (request, response) => {
  const notes = [];
  const id = request.params.id;
  const body = request.body;
  const note = notes.find((note) => note.id === id);
  console.log("Id is", id);
  if (note) {
    note.content = body.content;
    note.important = body.important;
    response.json(note);
  } else {
    response.status(404).end();
  }
};

const createNote = (request, response) => {
  const body = request.body;
  console.log(body);
  if (!body || !body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
};

const deleteNote = (request, response) => {
  const id = request.params.id;
  Note.findByIdAndDelete(id)
    .then((_) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
};

const registerRoutesForNotesIn = (app) => {
  app.get("/api/notes", getAllNotes);
  app.get("/api/notes/:id", getNote);
  app.put("/api/notes/:id", updateNote);
  app.post("/api/notes", createNote);
  app.delete("/api/notes/:id", deleteNote);
};

module.exports = registerRoutesForNotesIn;
