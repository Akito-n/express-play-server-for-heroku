var express = require('express');
var cors = require('cors');
var app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('build'));
var notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
];
app.get('/', function (req, res) {
    res.send('<h1>Hello World</h1>');
});
app.get('/api/notes', function (req, res) {
    res.json(notes);
});
app.get('/api/notes/:id', function (request, response) {
    var id = Number(request.params.id);
    console.log(id);
    var note = notes.find(function (note) { return note.id === id; });
    if (note) {
        response.json(note);
    }
    else {
        response.status(404).end();
    }
});
var generateId = function () {
    var maxId = notes.length > 0 ? Math.max.apply(Math, notes.map(function (n) { return n.id; })) : 0;
    return maxId + 1;
};
app.post('/api/notes', function (request, response) {
    var body = request.body;
    if (!body.content) {
        return response.status(400).json({ error: 'content missing' });
    }
    var note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    };
    notes = notes.concat(note);
    console.log('post record', note);
    response.json(note);
});
app["delete"]('/api/notes/:id', function (request, response) {
    var id = Number(request.params.id);
    notes = notes.filter(function (note) { return note.id === id; });
    response.status(204).end();
});
//   const app = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type' : 'text/plain'})
//   res.end(JSON.stringify(notes))
// })
var PORT = process.env.PORT || 3008;
app.listen(PORT);
console.log("server running on port " + PORT);
