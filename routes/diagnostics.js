const diagnostics = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');

// GET Route for retrieving diagnostic information
diagnostics.get('/', (req, res) => {
  readFromFile('./db/diagnosticss.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a error logging
diagnostics.post('/', (req, res) => {
  // TODO: Logic for appending data to the db/diagnostics.json file
  if (req.body) {
    const errors = req.body
    const timestamp = Date.now();
    const newError = {
      time: timestamp,
      error_id: uuidv4(),
      errors,
    };

    readAndAppend(newError, './db/diagnostics.json');
    res.json(`Error added successfully 🚀`);
  } else {
    res.error('Error in adding tip');
  }
});

module.exports = diagnostics;
