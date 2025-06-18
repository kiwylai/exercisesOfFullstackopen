const Note = require("./models/note");
const getAllNotes = (_, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
};

const getNote = (request, response, next) => {
  const id = request.params.id;
  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
};

const updateNote = (request, response, next) => {
  const { content, important } = request.body;
  const id = request.params.id;

  Note.findById(id)
    .then((note) => {
      if (!note) {
        return response.status(404).end();
      }

      note.content = content;
      note.important = important;

      return note.save().then((updatedNote) => {
        response.json(updatedNote);
      });
    })
    .catch((error) => next(error));
};

const createNote = (request, response, next) => {
  const body = request.body;
  console.log(body);
  if (!body || !body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
};

const deleteNote = (request, response) => {
  const id = request.params.id;
  Note.findByIdAndDelete(id)
    .then((result) => {
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
