// Componente "Repositório": nesta fase guarda os dados em memória.
const instancias = new Map();

function guardarInstancia(activityID) {
  if (!instancias.has(activityID)) {
    instancias.set(activityID, { activityID, criadaEm: new Date().toISOString() });
  }
  return instancias.get(activityID);
}

function lerInstancia(activityID) {
  return instancias.get(activityID) || null;
}

module.exports = { guardarInstancia, lerInstancia };
