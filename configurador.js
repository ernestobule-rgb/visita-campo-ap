// Componente "Configurador": define os parâmetros da atividade e gera a página de configuração.

const PARAMETROS = [
  { name: 'cultura', type: 'text/plain' },
  { name: 'instrucoes', type: 'text/plain' },
  { name: 'lista_pragas', type: 'text/plain' },
  { name: 'praga_esperada', type: 'text/plain' },
  { name: 'num_minimo_observacoes', type: 'integer' },
  { name: 'exige_fotografia', type: 'boolean' }
];

function obterParametros() {
  return PARAMETROS;
}

// Página embutida na Inven!RA. Cada campo tem name/id igual ao do parâmetro,
// para que a Inven!RA possa recolher os valores.
function gerarPaginaConfig() {
  return `<!doctype html>
<html lang="pt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Configuração — Visita de Campo Guiada</title>
<style>
  body { font-family: Arial, sans-serif; margin: 16px; max-width: 640px; }
  label { display: block; margin-top: 12px; font-weight: bold; }
  input, select, textarea { width: 100%; padding: 6px; box-sizing: border-box; }
  .ajuda { color: #555; font-size: 0.9em; }
</style>
</head>
<body>
<h2>Visita de Campo Guiada — configuração</h2>

<label for="cultura">Cultura a observar</label>
<select id="cultura" name="cultura">
  <option>Milho</option><option>Mandioca</option><option>Feijão</option><option>Arroz</option><option>Hortícolas</option>
</select>

<label for="instrucoes">Instruções e guião de observação</label>
<textarea id="instrucoes" name="instrucoes" rows="4">Observe 10 plantas escolhidas ao acaso. Registe os sintomas em cada uma e fotografe as folhas afetadas.</textarea>

<label for="lista_pragas">Pragas ou doenças possíveis (separadas por vírgula)</label>
<input id="lista_pragas" name="lista_pragas" type="text" value="Lagarta do funil, Ferrugem, Estria do milho">

<label for="praga_esperada">Praga esperada (só em parcelas de demonstração)</label>
<input id="praga_esperada" name="praga_esperada" type="text" value="">
<div class="ajuda">Deixe vazio numa parcela real.</div>

<label for="num_minimo_observacoes">Número mínimo de observações</label>
<input id="num_minimo_observacoes" name="num_minimo_observacoes" type="number" min="1" value="5">

<label for="exige_fotografia">Exigir fotografia em cada observação</label>
<select id="exige_fotografia" name="exige_fotografia">
  <option value="true">Sim</option><option value="false">Não</option>
</select>
</body>
</html>`;
}

module.exports = { obterParametros, gerarPaginaConfig };
