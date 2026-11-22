// Ponto de arranque do servidor do Activity Provider.
const express = require('express');
const apiInvenra = require('./apiInvenra');

const app = express();
app.set('trust proxy', true); // URLs com https quando alojado atrás de um proxy (ex.: Render)
// Aceita JSON mesmo que o pedido venha com Content-Type text/plain.
app.use(express.json({ type: ['application/json', 'text/plain'] }));
app.use(express.urlencoded({ extended: true }));

// Permite pedidos da plataforma Inven!RA a partir de outro domínio.
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use('/', apiInvenra);

app.get('/', (req, res) => {
  res.json({
    activityProvider: 'Visita de Campo Guiada',
    estado: 'em funcionamento',
    registo: '/registo-visita.json'
  });
});

// Pedido com JSON inválido: responde 400 em JSON, sem mostrar detalhes internos.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'O corpo do pedido não é JSON válido.' });
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do Activity Provider.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Activity Provider a escutar na porta ${PORT}`));

// Definição dos analytics: quantitativos {nome, tipo}; qualitativos {nome, slug}.
function definirAnalytics() {
  return {
    quantitativos: QUANTITATIVOS.map(({ nome, tipo }) => ({ nome, tipo })),
    qualitativos: QUALITATIVOS.map(({ nome, slug }) => ({ nome, slug }))
  };
}

// Resultados de cada formando de uma instância, em formato interno.
function calcularResultados(activityID) {
  return Object.entries(EXEMPLO).map(([stdID, v]) => ({
    stdID: Number(stdID),
    quantitativos: QUANTITATIVOS.map(q => ({ nome: q.nome, valor: v[q.chave] })),
    qualitativos: QUALITATIVOS.map(q => ({ nome: q.nome, slug: q.slug }))
  }));
}

// Página de uma analítica qualitativa, para um formando, numa atividade.
function paginaQualitativa(slug, activityID, stdID) {
  const q = QUALITATIVOS.find(x => x.slug === slug);
  const v = EXEMPLO[stdID];
  if (!q || !v) return null;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  return `<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>${esc(q.nome)}</title></head>
<body style="font-family:Arial,sans-serif;margin:16px">
<h2>${esc(q.nome)}</h2>
<p><b>Atividade:</b> ${esc(activityID)} · <b>Formando (Inven!RA):</b> ${esc(stdID)}</p>
<p>${esc(v[slug])}</p>
<p style="color:#666">Dados de exemplo (fase 1 do projeto).</p>
</body></html>`;
}

module.exports = { definirAnalytics, calcularResultados, paginaQualitativa };
