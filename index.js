"use strict";
exports.__esModule = true;
require('dotenv').config();
var express = require('express');
var Note = require('./models/note.ts');
var cors = require('cors');
var app = express();
app.use(express.static('build'));
app.use(express.json());
//app.use(logger)
app.use(cors());
app.get('/api/notes', function (req, res) {
    Note.find({}).then(function (notes) {
        res.json(notes);
    });
});
app.get('/api/notes/:id', function (request, response, next) {
    Note.findById(request.params.id).then(function (note) {
        if (note) {
            response.json(note);
        }
        else {
            response.status(404).end();
        }
    })["catch"](function (error) { return next(error); });
});
app.post('/api/notes', function (request, response, next) {
    var body = request.body;
    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' });
    }
    var note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });
    note.save().then(function (savedNote) {
        response.json(savedNote);
    })["catch"](function (error) { return next(error); });
});
app["delete"]('/api/notes/:id', function (request, response, next) {
    Note.findByIdAndRemove(request.params.id)
        .then(function (result) {
        response.status(204).end();
    })["catch"](function (error) { return next(error); });
});
app.put('/api/notes/:id', function (request, response, next) {
    console.log('putted');
    var body = request.body;
    var note = {
        content: body.content,
        important: body.important
    };
    Note.findByIdAndUpdate(request.params.id, note, { "new": true })
        .then(function (updatedNote) {
        response.json(updatedNote);
    })["catch"](function (error) { return next(error); });
});
var unknownEndpoint = function (request, response) {
    response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);
var errorHandler = function (error, request, response, next) {
    console.error(error.message);
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }
    next(error);
};
app.use(errorHandler);
var PORT = process.env.PORT;
app.listen(PORT);
console.log("server running on port " + PORT);
