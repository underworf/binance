// Importamos el módulo express, que nos permite manejar fácilmente las rutas y los endpoints.
const express = require('express');

const Binance = require('node-binance-api');
const app = express();
const port = 3019;


const binance = new Binance().options({
    APIKEY: 'WW6q3r8rPqETKcCIAKBmDgKL6UjtNQRjoGqH8ZTUHMfDcKnJcFsupwfWwLWJWAg5',
    APISECRET: '5OoKN7p96l6y1NGtJzyPrtkX3yoO0T0RthLVNlZo9Z43JGgEC8pONGhhgSl8iksr'
});

app.get('/buy', async (req, res) => {
    const symbol = req.query.symbol;
    const quantity = parseFloat(req.query.quantity);
    const takeProfitPercent = parseFloat(req.query.takeProfitPercent);

    if (!symbol || !quantity || !takeProfitPercent) {
        res.send({
            symbol,
            quantity,
            takeProfitPercent,
        });
    }

    const prices = await binance.futuresPrices();
    const buyResponse = await binance.futuresMarketBuy(symbol, quantity);
    const fillPrice = parseFloat(prices[symbol]);
    const takeProfitPrice = fillPrice * (1 + takeProfitPercent / 100);


    const TP= await binance.futuresSell(symbol, quantity,takeProfitPrice.toFixed(4) );
    //const SL  = await binance.futuresBuy(symbol, quantity,stopLostPrice.toFixed(4) );
    res.send({
        buyResponse,
        TP
      
    });

});


app.get('/sell', async (req, res) => {
    const symbol = req.query.symbol;
    const quantity = parseFloat(req.query.quantity);
    const takeProfitPercent = parseFloat(req.query.takeProfitPercent);

    if (!symbol || !quantity || !takeProfitPercent) {
        res.send({
            symbol,
            quantity,
            takeProfitPercent,
        });
    }

    const prices = await binance.futuresPrices();
    const sellResponse = await binance.futuresMarketSell(symbol, quantity);

    const fillPrice = parseFloat(prices[symbol]);

    res.send({
        fillPrice
    });
    const takeProfitPrice = fillPrice * (1 - takeProfitPercent / 100);
    //const stopLostPrice = fillPrice * (1 + takeProfitPercent / 100);

    const TP = await binance.futuresBuy(symbol, quantity,takeProfitPrice.toFixed(4) );
    //const SL  = await binance.futuresBuy(symbol, quantity,stopLostPrice.toFixed(4) );
    res.send({
        sellResponse,
        TP 
    });

});
app.listen(port, () => {
    console.log(`Aplicación escuchando en http://localhost:${port}`);
});