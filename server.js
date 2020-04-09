const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const fs = require('fs');
let resposta = {};

resposta["cad:buscarFeriado"] = {
    "Envelope": {
        "Body": {
            "buscarFeriadoResponse": {
                "outBuscarFeriado": {
                    "dias": {
                        "dia": "2019-03-27T00:00:00-02:00",
                        "flagDiaUtil": "S"
                    }
                }
            }
        }
    }
};


fs.readFile('dias-uteis.json', (err, data) => {
    if (err) throw err;
    resposta["cad:testarDiasUteis"] = JSON.parse(data);
});

const bodyParser = require('body-parser')

server.use(
    bodyParser.urlencoded({
        extended: true
    })
)

server.use(bodyParser.json())


// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.post('/token', (req, res) => {
    console.log('obtendo token');
    res.jsonp({
        "access_token": "21e4a989-c08b-3d9e-b62f-17ee4fd5dc42",
        "scope": "am_application_scope default",
        "token_type": "Bearer",
        "expires_in": 1619
    });
})

server.post('/CadastroService/', (req, res) => {
    console.log('obtendo dias úteis');
    console.log(req.body);

    res.jsonp(resposta[Object.keys(req.body)[0]]);
})



// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.createdAt = Date.now()
    }
    // Continue to JSON Server router
    next()
})

// Use default router
server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})