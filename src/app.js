'use strict';

const express      = require('express');
const bodyParser   = require('body-parser');
const cryptoPrices = require('./cryptoPrices')

const app          = express();
const router       = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const route = router.get('/', (req, res, next) => {
    res.status(200).send({
        title: "Cryptocurrency Prices Live",
		project: "https://github.com/jorcelinojunior/cryptocurrency-prices-live",
        version: "0.0.1"
    });
});


const cotacao = router.get('/quotation/coinmarketcap/:coinName?', (req, res, next) => {
    var coinName = req.params.coinName;

    cryptoPrices().then((response, error) => {
        var coinValue = response;

        if (coinName) {
            coinName  = coinName.toUpperCase();
            coinValue = response[coinName]
            coinValue = coinValue ? coinValue : `Cryptocurrency "${coinName}" was not found.`;
        }
        
        res.status(200).send(coinValue);
    });
});

const create = router.post('/', (req, res, next) => {
    res.status(201).send(req.body);
});

const put = router.put('/:id', (req, res, next) => {
    const id = req.params.id;
    cryptoQuotation().then((response, error) => {

        res.status(201).send({
            id: id,
            item: response
        });
    })
});

app.use('/', route);
app.use('/quotation/coinmarketcap/', cotacao);
app.use('/products', create);

module.exports = app;