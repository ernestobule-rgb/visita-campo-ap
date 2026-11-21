// Ponto de arranque do servidor do Activity Provider.
const express = require('express');
const apiInvenra = require('./componentes/apiInvenra');

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
