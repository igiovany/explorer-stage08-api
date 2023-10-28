const express = require("express")

const app = express()

app.get("/message/:id/:user", (request, response) => {

  const { id, user } = request.params

  response.send(`
    Message ID: ${id}. 
    For user: ${user}.
  `)
})

app.get("/users", (request, response) => {
  //http://localhost:3333/users?page=2&limit=15
  const {page, limit} = request.query

  response.send(`Page: ${page}. Show: ${limit}`)
})

const PORT = 3333
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))
