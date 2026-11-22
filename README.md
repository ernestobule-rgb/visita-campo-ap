# Activity Provider «Visita de Campo Guiada» (Inven!RA)

Projeto da UC 22304 Arquitetura e Padrões de Software (MEIW, Universidade Aberta).
Autor: José Ernesto Constantino Bule.

Servidor RESTful que responde, com dados de exemplo, aos serviços de um Activity Provider
definidos no documento «Activity Providers na Inven!RA» e na página «Pedidos da Inven!RA e formatos de dados».

## Serviços

| Serviço | Método e caminho | Componente (arquitetura) |
|---|---|---|
| Ficheiro de registo | `GET /registo-visita.json` | API Inven!RA |
| config_url | `GET /configuracao-visita.html` | Configurador |
| json_params_url | `GET /json-params-visita` | Configurador |
| user_url (deploy) | `GET /deploy-visita?activityID=...` ou `GET /deploy-visita/<activityID>` | Gestor de Instâncias |
| analytics_list_url | `GET /lista-analytics-visita` | Motor de Analytics |
| analytics_url | `POST /analytics-visita` com `{"activityID": "..."}` | Motor de Analytics |

- A página de configuração tem os campos `cultura`, `instrucoes`, `lista_pragas`, `praga_esperada`,
  `num_minimo_observacoes` e `exige_fotografia`, que a Inven!RA recolhe pelo nome. Não tem botão de guardar.
- O deploy devolve, em texto, o URL de acesso à instância: `/visita/<activityID>`.
- As analíticas quantitativas são devolvidas como `{name, value}`. As qualitativas são URL de páginas
  com o resultado de cada formando: `GET /analytic/<analitica>/<activityID>/<stdID>`.
- A conversão para o formato da Inven!RA é feita só na API Inven!RA (`apiInvenra.js`);
  o Motor de Analytics trabalha com um formato interno.
- O acesso do formando («Provide activity») fica para uma fase posterior do projeto;
  por agora, o URL `/visita/<activityID>` responde com o código 501.
- O Repositório guarda as instâncias em memória.

## Estrutura

    server.js             arranque do servidor
    apiInvenra.js         pedidos da Inven!RA e conversão de formato
    configurador.js       parâmetros e página de configuração
    gestorInstancias.js   criação de instâncias no deploy
    repositorio.js        armazenamento das instâncias
    motorAnalytics.js     definição e valores dos analytics

## Executar localmente

    npm install
    npm start

O servidor fica em http://localhost:3000.

## Testar

    curl https://<domínio>/registo-visita.json
    curl https://<domínio>/json-params-visita
    curl "https://<domínio>/deploy-visita?activityID=visita-0042"
    curl https://<domínio>/lista-analytics-visita
    curl -X POST -H "Content-Type: application/json" -d '{"activityID":"visita-0042"}' https://<domínio>/analytics-visita
