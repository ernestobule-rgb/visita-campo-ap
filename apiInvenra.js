// Componente "API Inven!RA": recebe os pedidos da especificação e delega
// nos componentes internos (ver diagrama de componentes, E1–E6).
const express = require('express');
const configurador = require('./configurador');
const gestorInstancias = require('./gestorInstancias');
const motorAnalytics = require('./motorAnalytics');

const router = express.Router();

function baseUrl(req) {
  return process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
}

// Conversão para o formato da Inven!RA ("Pedidos da Inven!RA e formatos de dados").
// É o único sítio do servidor que conhece esse formato.
function listaParaInvenra(def) {
  return {
    qualAnalytics: def.qualitativos.map(q => ({ name: q.nome, type: 'URL' })),
    quantAnalytics: def.quantitativos.map(q => ({ name: q.nome, type: q.tipo }))
  };
}

function resultadosParaInvenra(resultados, activityID, b) {
  return resultados.map(r => ({
    inveniraStdID: r.stdID,
    quantAnalytics: r.quantitativos.map(q => ({ name: q.nome, value: q.valor })),
    qualAnalytics: r.qualitativos.map(q => ({
      [q.nome]: `${b}/analytic/${q.slug}/${encodeURIComponent(activityID)}/${r.stdID}`
    }))
  }));
}

// Ficheiro de registo da atividade.
router.get('/registo-visita.json', (req, res) => {
  const b = baseUrl(req);
  res.json({
    name: 'Visita de Campo Guiada',
    config_url: `${b}/configuracao-visita.html`,
    json_params_url: `${b}/json-params-visita`,
    user_url: `${b}/deploy-visita`,
    analytics_url: `${b}/analytics-visita`,
    analytics_list_url: `${b}/lista-analytics-visita`
  });
});

// E1 — config_url: página de configuração (C1 gerarPaginaConfig).
router.get('/configuracao-visita.html', (req, res) => {
  res.type('html').send(configurador.gerarPaginaConfig());
});

// E2 — json_params_url: lista de parâmetros (C1 obterParametros).
router.get('/json-params-visita', (req, res) => {
  res.json(configurador.obterParametros());
});

// E3 — user_url: deploy de uma instância (C3 criarInstancia).
// A especificação indica que recebe o identificador da instância e devolve um URL.
// Como não fixa o nome do parâmetro, aceita-o no caminho, na query ou no corpo.
function deploy(req, res) {
  const id = req.params.activityID || req.query.activityID || (req.body && req.body.activityID);
  if (!id) {
    return res.status(400).json({ erro: 'Falta o parâmetro activityID.' });
  }
  const url = gestorInstancias.criarInstancia(String(id), baseUrl(req));
  res.type('text/plain').send(url);
}
router.get('/deploy-visita', deploy);
router.post('/deploy-visita', deploy);
router.get('/deploy-visita/:activityID', deploy);

// E5 — analytics_list_url: lista de analytics (C9 definirAnalytics).
router.get('/lista-analytics-visita', (req, res) => {
  res.json(listaParaInvenra(motorAnalytics.definirAnalytics()));
});

// E6 — analytics_url: analytics de todos os formandos de uma instância (C9 calcularResultados).
router.post('/analytics-visita', (req, res) => {
  const activityID = req.body && req.body.activityID;
  if (!activityID) {
    return res.status(400).json({ erro: 'Falta activityID no corpo do pedido.' });
  }
  const id = String(activityID);
  const resultados = motorAnalytics.calcularResultados(id);
  res.json(resultadosParaInvenra(resultados, id, baseUrl(req)));
});

// Páginas das analíticas qualitativas (URL devolvidos em qualAnalytics).
router.get('/analytic/:slug/:activityID/:stdID', (req, res) => {
  const html = motorAnalytics.paginaQualitativa(req.params.slug, req.params.activityID, req.params.stdID);
  if (!html) return res.status(404).send('Analítica não encontrada.');
  res.type('html').send(html);
});

// E4 — acesso do formando ("Provide activity"): fica para uma fase posterior.
// Por agora, o URL devolvido no deploy responde a qualquer método com 501.
router.all('/visita/:activityID', (req, res) => {
  res.status(501).json({
    activityID: req.params.activityID,
    erro: 'Acesso do formando («Provide activity») ainda não implementado nesta fase do projeto.'
  });
});

module.exports = router;
