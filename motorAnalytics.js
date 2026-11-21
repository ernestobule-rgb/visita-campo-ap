// Componente "Motor de Analytics": define os analytics e calcula os valores por formando.
// Nesta fase devolve dados de exemplo.
// Não conhece o formato da Inven!RA: a conversão é feita na API Inven!RA (apiInvenra.js).

const QUALITATIVOS = [
  { nome: 'Relatório da visita', slug: 'relatorio' },
  { nome: 'Recomendação ao produtor', slug: 'recomendacao' },
  { nome: 'Data da última sincronização', slug: 'sincronizacao' }
];

const QUANTITATIVOS = [
  { nome: 'Acedeu às instruções', tipo: 'boolean', chave: 'instrucoes' },
  { nome: 'Iniciou a visita de campo', tipo: 'boolean', chave: 'iniciou' },
  { nome: 'Número de observações registadas', tipo: 'integer', chave: 'obs' },
  { nome: 'Fotografias submetidas', tipo: 'integer', chave: 'fotos' },
  { nome: 'Identificação correta da praga', tipo: 'boolean', chave: 'correta' },
  { nome: 'Tempo total da atividade (minutos)', tipo: 'integer', chave: 'minutos' },
  { nome: 'Atividade concluída', tipo: 'boolean', chave: 'concluida' }
];

// Dados de exemplo de dois formandos.
const EXEMPLO = {
  1001: { instrucoes: true, iniciou: true, obs: 6, fotos: 6, correta: true, minutos: 74, concluida: true,
          recomendacao: 'Aplicar controlo no funil nas próximas 48 horas.', sincronizacao: '2026-11-16T09:15',
          relatorio: 'Milho, parcela de demonstração. 6 observações com fotografia. Praga identificada: lagarta do funil.' },
  1002: { instrucoes: true, iniciou: false, obs: 0, fotos: 0, correta: false, minutos: 0, concluida: false,
          recomendacao: '(ainda sem recomendação)', sincronizacao: '(ainda não sincronizou)',
          relatorio: 'O formando abriu as instruções mas ainda não iniciou a visita.' }
};

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
