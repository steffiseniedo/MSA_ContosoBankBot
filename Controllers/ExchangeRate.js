var rest = require('../API/Restclient');
var builder = require('botbuilder');

exports.currencyExchange = function getExchange(session, fromCurr, toCurr, amount){

    var url ='https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency='+fromCurr+'&to_currency='+toCurr+'&apikey=4UJ7C2O2W5QM5H7W';
    rest.getExchangeRate(url, session, displayExchangeRate, fromCurr, toCurr, amount);
}

function showExchangeRate(message, session, fromCurr, toCurr, amount){
    var exchangeRateResponse = JSON.parse(message);
    var output = response["Realtime Currency Exchange Rate"];
    var finalAmount = output["5. Exchange Rate"] * amount;
    //session.send("Exchange rate: %s %s is equal to %s %s", amount, fromCurr, finalAmount, toCurr);


    session.send(new builder.Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "0.5",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Exchange rate: " + fromCurr + "to" + toCurr,
                            "size": "large"
                        },
                        {
                            "type": "TextBlock",
                            "text": ("%s %s is equal to %s %s", amount, fromCurr, finalAmount, toCurr)
                        }
                    ]
                } 
            ]
        }
    }));

}
