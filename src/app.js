'use strict';

const express      = require('express');
const bodyParser   = require('body-parser');
const cryptoPrices = require('./cryptoPrices')

const app    = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const route = router.get('/', (req, res, next) => {
    res.status(200).send({
        title: "Node Store API",
        version: "0.0.1"
    });
});


const cotacao = router.get('/quotation/coinmarketcap/:cryptocurrency?', (req, res, next) => {
    var cryptocurrency = req.params.cryptocurrency;

    cryptoPrices().then((response, error) => {
        var allCoins = response;
        var value    = allCoins;

        if(cryptocurrency){
            cryptocurrency  = cryptocurrency.toUpperCase();
            value = allCoins.find((coin) => coin.name === cryptocurrency);
            value = value ? value.price : 'Cryptocurrency: "' + cryptocurrency + '" not found!';
        }

        res.status(200).send(value);
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