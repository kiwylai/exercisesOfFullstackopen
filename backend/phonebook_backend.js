const Person = require("./models/person");
const getAllPersons = (_, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
};

const getInformation = (request, response) => {
  console.log("getInformation");
  // TODO fix implementation
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((_) => {
      response.status(404).end();
    });
};

const getPerson = (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
};

const createPerson = (request, response, next) => {
  const { name, number } = request.body;
  const id = request.params.id;

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }

      person.name = name;
      person.number = number;

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson);
      });
    })
    .catch((error) => next(error));
};

const deletePerson = (request, response, next) => {
  console.log("deletePerson");
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
