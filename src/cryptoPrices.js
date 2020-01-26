'use strict'

const request = require('request');
const cheerio = require('cheerio');
const timeDefault = 60000;

var runFirstTime = false;
var result = [];

function cleanPricesList() {
    setTimeout(() => {
        console.log(".......It will clear the variable with prices!");
        result = [];
        cleanPricesList(timeDefault * 1000);
    }, timeDefault * 1000);
}

function countSeconds(seconds) {
    setTimeout(() => {
        console.log(seconds + " seconds");
        countSeconds(++seconds);
    }, 1000);
}

function getPrices() {
    if (!runFirstTime) {
        cleanPricesList();
        countSeconds(0);
    }

    console.log(".......Does the variable contain data? : " + (result.length > 0));
    return new Promise((resposta, error) => {
        if (result.length > 0) {
            console.log(".......Take the price of the variable.");
            resposta(result);
        } else {
            getPriceCoinsOnCoinMarketCap()
                .then((response, error) => {
                    result = response;
                    resposta(result);
                });
        }
    });
}

function getPriceCoinsOnCoinMarketCap() {
    const urlSite = 'https://coinmarketcap.com/';
    runFirstTime = true;
    
    console.log(".......Go to the website (" + urlSite + ") home to get the prices.");
    return new Promise((response, error) => {
        request({
            method: 'GET',
            uri: urlSite,
            encoding: null
        }, function (err, res, body) {
            if (err) error("Error: " + err);

            var $ = cheerio.load(body);
            var cryptoValues = [];

            $('.cmc-table__table-wrapper-outer table tbody tr').each(function () {
                var name = $(this).find('td[class*="circulating-supply"]').text();
                var aux = name.split(' ');
                name = aux[1].toUpperCase();

                var price = $(this).find('td[class*="price"]').text();
                price = price.replace('$', '').split(',').join('');

                var crypto = {};
                crypto["name"] = name;
                crypto["price"] = price;

                cryptoValues.push(crypto);
            });
            response(cryptoValues);
        });
    });
}

module.exports = getPrices;