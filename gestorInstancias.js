// Componente "Gestor de Instâncias": cria uma instância por activityID no deploy.
const repositorio = require('./repositorio');

function criarInstancia(activityID, baseUrl) {
  repositorio.guardarInstancia(activityID);
  return `${baseUrl}/visita/${encodeURIComponent(activityID)}`;
}

function existeInstancia(activityID) {
  return repositorio.lerInstancia(activityID) !== null;
}

module.exports = { criarInstancia, existeInstancia };
