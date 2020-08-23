const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

interface Note {
    content: string,
    important: boolean,
    date: Date | string,
    id: number
  }

let notes: Note[] = [
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
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {

  const body = request.body

  if(!body.content){
    return response.status(400).json({error: 'content missing'})
  }

  const note: Note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId()
  }

  notes = notes.concat(note)

  console.log('post record', note)
  response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id === id)
  response.status(204).end()
})

//   const app = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type' : 'text/plain'})
//   res.end(JSON.stringify(notes))
// })

const PORT = process.env.PORT || 3008
app.listen(PORT)

console.log(`server running on port ${PORT}`)
