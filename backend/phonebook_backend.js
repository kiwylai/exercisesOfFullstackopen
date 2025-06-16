const Person = require("./models/person");
const getAllPersons = (_, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
};

const getInformation = (request, response) => {
  // TODO fix implementation
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((_) => {
      response.status(404).end();
    });
};

const getPerson = (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((_) => {
      response.status(404).end();
    });
};

const createPerson = (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
};

const deletePerson = (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((_) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
};

const registerRoutesForPersonsIn = (app) => {
  app.get("/api/persons", getAllPersons);
  app.get("/info", getInformation);
  app.get("/api/persons/:id", getPerson);
  app.post("/api/persons", createPerson);
  app.delete("/api/persons/:id", deletePerson);
};

module.exports = registerRoutesForPersonsIn;
