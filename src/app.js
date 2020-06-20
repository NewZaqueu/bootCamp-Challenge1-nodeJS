const express = require("express");
const {uuid, isUuid} = require('uuidv4')

const app = express();

app.use(express.json());
const repositories = [];

//Middlewares

function idValidation (request,response,next){
  const {id} = request.params

  if (!isUuid(id)){
    return response.status(400).json({message: "Incorrect ID format, please review it."})
  } else{
    const repositoryIndex = repositories.findIndex( repository => repository.id === id)
    if (repositoryIndex < 0){
      return response.status(400).json({message: "ID not found, please review it"})
    }
    return next()
  }
  
}

function dataValidation (request,response,next){
  const { title, url, techs } = request.body
  const form = [title, url, techs]
  form.map(item => {
    if (!item){
      return response.status(400).json({ message: `Missing information, please review.`})
    }
  })
  return next()
}

app.use("/repositories/:id",idValidation)
app.use("/repositories/:id/like",idValidation)

//Rotas

//Listar repositórios

app.get("/repositories", (request, response) => {
  return response.json(repositories)
  // TODO
});

//Criar repositórios

app.post("/repositories", dataValidation, (request, response) => {
  const { title, url, techs } = request.body
  const likes = 0
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes
  }

  repositories.push(repository)

  return response.json(repository)

});

//Atualizar repositórios

app.put("/repositories/:id", dataValidation, (request, response) => {
  const { id } = request.params
  const { title, url, techs} = request.body

  const repositoryIndex = repositories.findIndex( repository => repository.id === id)
  repositories[repositoryIndex].title = title
  repositories[repositoryIndex].url = url
  repositories[repositoryIndex].techs = techs

  return response.json(repositories[repositoryIndex])
});

// Deletar repositórios

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex( repository => repository.id === id)
  repositories.splice(repositoryIndex,1)

  return response.status(204).json({message: "Repository deleted"})
});

// Curtir repositório

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const { title, url, techs} = request.body

  const repositoryIndex = repositories.findIndex( repository => repository.id === id)
  const repository = repositories[repositoryIndex]
  repository.likes ++ 

  return response.json({
    likes: repository.likes
  })

});


module.exports = app;
