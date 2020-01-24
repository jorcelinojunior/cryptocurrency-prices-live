'use strict'

const request = require('request');
const cheerio = require('cheerio');

function getQuotationCoinMarketCap() {
    const urlSite = 'https://coinmarketcap.com/';

    return new Promise((response, error) => {
        request({
            method   : 'GET',
            uri      : urlSite,
            encoding : null
        }, function(err, res, body) {
            if (err) error("Erro: " + err);

            var $            = cheerio.load(body);
            var cryptoValues = [];

            $('.cmc-table__table-wrapper-outer table tbody tr').each(function() {
                var name = $(this).find('td[class*="circulating-supply"]').text();
                var aux  = name.split(' ');
                    name = aux[1].toUpperCase();

                var price = $(this).find('td[class*="price"]').text();
                    price = price.replace('$','').split(',').join('');

                var crypto = {};
                    crypto["name"]  = name;
                    crypto["price"] = price;
                
                cryptoValues.push(crypto);
            });

            response(cryptoValues);
            //console.log(cryptoValues);
        });
    });
}

// getQuotationCoinMarketCap().then((response, error) => {
//     console.log(response);
// });

module.exports = getQuotationCoinMarketCap;

// console.log(values.find((x) => x["nome"] === "LTC"))
// console.log(values.find((x) => x.name === "MANA"))
