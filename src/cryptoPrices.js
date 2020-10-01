'use strict'

const request = require('request');
const cheerio = require('cheerio');
const timeDefault = 30; // Defina o intervalo em segundos que a aplicação deverá limpar os preços

var runFirstTime = false;
var result       = [];

function cleanPricesList() {
    setTimeout(() => {
        console.log(".......It will clear the variable with prices!");
        result = [];
        cleanPricesList(timeDefault * 1000);
    }, timeDefault * 1000);
}

function countSeconds(seconds) {
    setTimeout(() => {
        //console.log(seconds + " seconds");
        countSeconds(++seconds);
    }, 1000);
}

function getPrices() {
    if (!runFirstTime) {
        cleanPricesList();
        countSeconds(0);
    }

    console.log(".......Does the variable contain data? : " + (Object.keys(result).length !== 0));
    return new Promise((resposta, error) => {
        if (Object.keys(result).length !== 0) {
            console.log(".......Take the price of the variable.");
            resposta(result);
        } else {
            getPriceCoinsOnCoinMarketCap()
                .then((response, error) => {
                    result = response;
                    resposta(response);
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
            var cryptoValues = {};
            

            //console.log(cheerio.load(body))

            $('tr.cmc-table-row').each(function () {
                //var name   = $(this).find('td[class*="circulating-supply"] div').text();
                // var name   = $($($(this).find('td'))[5]).text();
                var tdName   = $(this).find('td[class*="rc-table-cell"] div.gxonsA p[color="text2"]').text();

                if(tdName == null || tdName == "") return 

                let [volume, name] = tdName.split(' ');
                name = name.toUpperCase().trim();
                
                //console.log("name: " + name);

                var price  = $($(this).find('td')[3]).find('a').text();
                console.log('price: ', price)

                price      = price.replace('$', '').split(',').join('');


                var crypto = {};
                // crypto["name"] = name;
                // crypto["price"] = price;
                cryptoValues[name] = price;

                //cryptoValues.push(crypto);
            });
            response(cryptoValues);
        });
    });
}

module.exports = getPrices;