const express = require('express');
const router = express.Router();

const { Entry } = require('../models/entry');

router.post('/', (req, res) => {
  const data = req.body;
  const newEntry = Entry.create(data);
  res.status(201).send(newEntry);
});

router.get('/', (req, res) => {
  const allEntries = Entry.all;
  res.status(200).send(allEntries);
});

router.post('/reaction', (req, res) => {
  const data = req.body;
  Entry.addReaction(parseInt(data.id), data.reaction);
  const returnedEntry = Entry.findById(parseInt(data.id))
  res.status(201).send(returnedEntry);
});

router.post('/comment', (req, res) => {
  const data = req.body;
  Entry.addComment(parseInt(data.id), data.comment);
  const returnedEntry = Entry.findById(parseInt(data.id))
  res.status(201).send(returnedEntry);
});

module.exports = router;
